import { AssessmentData, Report, DecisionItem, AntibodyInfo } from './types';
import { ANTIBODY_DATA } from './constants';

export const calculateDelayDate = (bloodType: string, bloodDate: string): { date: string; months: number } | null => {
  if (!bloodType || !bloodDate || !ANTIBODY_DATA[bloodType]) return null;
  const months = ANTIBODY_DATA[bloodType].wait;
  const d = new Date(bloodDate);
  if (isNaN(d.getTime())) return null;
  
  d.setMonth(d.getMonth() + months);
  return { date: d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }), months };
};

export const generateAssessmentReport = (data: AssessmentData): Report => {
  const decisions: DecisionItem[] = [];

  const ageNum = parseFloat(data.age) || 0;
  const ageInMonths = data.ageUnit === 'years' ? ageNum * 12 : ageNum;

  // Rule 1: q1_acute_illness
  if (data.answers.q1_acute_illness) {
    const sub = data.details.q1_subType || 'severe';
    if (sub === 'severe') {
      decisions.push({
        ruleId: 'q1_acute_illness',
        ruleTitle: '急性期发热/疾病 (中重度)',
        code: 'yellow',
        title: '暂缓接种 (Yellow Light)',
        action: '挂起当前接种。避免接种后的一过性发热等全身反应与原发疾病的病情进展发生诊断混淆。',
        guidance: '待患儿急性期痊愈、恢复精神和食欲后再行评估接种。',
        advice: '“如果宝宝今天有高烧、精神委靡等中重度急性病，我们建议先等孩子病情好转、恢复精神后再接种。这并不是因为疫苗不安全，而是为了避免疫苗可能引起的轻微发热加重或掩盖宝宝当下的病情，影响医生判断。”',
        mechanism: '中重度疾病期间暂缓，旨在避免接种后的急性一过性全身反应（如发热）与原发病的发展相混淆，干扰诊断。',
      });
    } else {
      decisions.push({
        ruleId: 'q1_acute_illness',
        ruleTitle: '急性期发热/疾病 (轻度)',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规程序接种。接种后必须在接种点平卧或静坐强制留观 15 至 30 分钟。',
        guidance: '轻微感冒、流涕、无发热的轻度腹泻或中耳炎，且精神食欲良好，标记为准予接种。正常开展接种。',
        advice: '“如果宝宝只是轻微流鼻涕、打喷嚏，精神和食欲都很好，这属于轻度感冒，完全可以照常打针，既不会增加副作用，也不会降低疫苗效果。”',
        mechanism: '轻微急性疾病（如无热感冒、轻度腹泻等）不影响机体对疫苗的免疫应答，且不会增加不良反应发生率。',
      });
    }
  }

  // Rule 2: q2_severe_allergies
  if (data.answers.q2_severe_allergies) {
    const sub = data.details.q2_subType || 'severe';
    if (sub === 'severe') {
      decisions.push({
        ruleId: 'q2_severe_allergies',
        ruleTitle: '严重过敏史 (疫苗特定成分或材质)',
        code: 'red',
        title: '绝对禁忌 (Red Light)',
        action: '对应疫苗的绝对禁忌。绝对禁止接种含有该特定过敏成分或接触相关包装的疫苗剂次。',
        guidance: '记录绝对禁忌证档案。明胶严重过敏者禁用 MMR、水痘等减毒活疫苗；酵母严重过敏者禁用重组乙肝疫苗；乳胶过敏者应避免接触含乳胶瓶塞的包装，可选择预充式无乳胶注射器。',
        advice: '“严重的全身过敏反应（如呼吸困难、面部水肿或休克）需要高度警惕。我们需要核实过敏的具体源头，避开含有相同成分的疫苗（例如对明胶严重过敏的宝宝不能接种麻腮风或水痘疫苗；对酵母严重过敏的不能接种乙肝疫苗）。今天接种需绝对避开致敏疫苗。”',
        mechanism: '全身性过敏反应（Anaphylaxis）可危及生命。由于疫苗中含有微量明胶、酵母或使用乳胶瓶塞，特异性致敏个体再次暴露将触发极高风险的 IgE 介导严重过敏反应。',
      });
    } else {
      decisions.push({
        ruleId: 'q2_severe_allergies',
        ruleTitle: '普通或非重度过敏',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规接种。必须在接种点平卧或静坐强制留观 30 分钟。',
        guidance: '对普通食物、花粉、不相关药物的非重度过敏，或普通湿疹，标记为准予接种。要求强制留观 30 分钟。',
        advice: '“普通的皮肤湿疹、轻微皮疹、或者对某种食物（如芒果、牛奶）的轻度过敏，都不影响疫苗接种。为了让您放心，我们今天接种后，会让宝宝在门诊留观 30 分钟，确保安全。”',
        mechanism: '非疫苗特异性成分的普通食物、花粉过敏或皮肤湿疹等不属于接种禁忌，正常接种伴随加强留观即可防范万一。',
      });
    }
  }

  // Rule 3: q3_past_severe_reaction
  if (data.answers.q3_past_severe_reaction) {
    const sub = data.details.q3_subType || 'anaphylaxis';
    if (sub === 'anaphylaxis') {
      decisions.push({
        ruleId: 'q3_past_severe_reaction',
        ruleTitle: '既往接种同款疫苗后严重反应史',
        code: 'red',
        title: '该疫苗后续剂次的绝对禁忌 (Red Light)',
        action: '该特定疫苗后续剂次的绝对禁忌。永久取消接种该疫苗的后续剂次。',
        guidance: '记录绝对禁忌证档案。后续改用其他不含该抗原或成分的疫苗或物理防护措施来替代。',
        advice: '“如果宝宝以前接种某一种疫苗后出现过紧急抢救（过敏性休克、喉头水肿）或呼吸困难，我们绝对不会再给他接种相同成分的疫苗，会通过其他疫苗或保护措施来替代。请您放心。”',
        mechanism: '既往严重的疫苗后过敏反应是同类疫苗注射的绝对禁忌。再次接种可能诱发更迅速、更致命的全身性过敏性休克。',
      });
    } else {
      decisions.push({
        ruleId: 'q3_past_severe_reaction',
        ruleTitle: '既往 DTaP 接种后反应',
        code: 'yellow',
        title: '慎用/需谨慎评估 (Yellow Light / Precaution)',
        action: '作为后续 DTaP（百白破成分疫苗）的慎用指征。临床医生需详细评估风险与收益，决定是否接种或用其他方案替代。',
        guidance: '若既往接种 DTaP 后 48 小时内出现：发热 ≥ 40.5℃、持续 ≥ 3 小时无法抚慰的哭闹、低张性低反应性发作（HHE），或 3 天内发生惊厥，标记为后续 DTaP 的慎用指征。需评估风险与收益。',
        advice: '“如果宝宝以前打完百白破仅仅是打针的地方有些红肿、发硬、或者出现过中低烧、哭闹，这些是正常免疫反应。但如果出现过高烧、抽搐，再次打含百白破的疫苗时需要医生慎重评估。接种后我们会加强留观，请您放心。”',
        mechanism: '严重的全身过敏反应是绝对禁忌。而既往 DTaP 接种后的高热、HHE、惊厥在现代临床中已被降级为慎用指征，不作为绝对禁忌，但在再次接种时仍需密切防范和监护。',
      });
    }
  }

  // Rule 4: q4_chronic_diseases
  if (data.answers.q4_chronic_diseases) {
    const sub = data.details.q4_subType || 'chronic_aspirin';
    if (sub === 'asplenia') {
      decisions.push({
        ruleId: 'q4_chronic_diseases',
        ruleTitle: '无脾或功能性无脾/补体缺陷 (分支 C)',
        code: 'yellow',
        title: '需特殊强化接种程序 & 活疫苗限制 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌！ 启动分支 C (无脾/补体缺陷) 强化结合疫苗接种路径。',
        guidance: '1. 肺炎链球菌结合疫苗强化：小于2岁常规完成4剂PCV基础接种。大于等于2岁既往未接种PCV20的无脾患儿，若既往仅接种过PCV13/15，补种1剂次PCV20，或接种1剂次PPSV23（间隔>=8周，5年后重种第二剂）。\n2. 脑膜炎球菌结合疫苗强化：自2个月龄起启动MenACWY基础系列。若首剂年龄 < 7岁，每3年定期加强1剂；若首剂年龄 >= 7岁，每5年定期加强1剂。自10岁起常规完成2剂次MenB基础免疫。\n3. 无脾儿 Hib 疫苗强化：对大于等于5岁且从未接种过Hib的无脾儿童，补种1剂次单价Hib结合疫苗。\n4. MenACWY-D (Menactra) 与 PCV 免疫干扰规避：若患儿有无脾或HIV且同时需要PCV和MenACWY-D，先完成所有PCV，且至少间隔4周后再接种MenACWY-D（优先推荐使用非白喉载体脑膜炎疫苗如 Menveo 以免此约束）。',
        advice: '“由于宝宝没有脾脏、镰状细胞贫血或有补体缺陷，身体对特定细菌（如肺炎球菌、脑膜炎球菌、Hib流感嗜血杆菌）的抵抗力会非常差，极易发生致命性的暴发性感染（OPSI）。因此，孩子更急需接种专门的强化疫苗程序来提高抗体水平。另外，绝对不能使用喷鼻流感活疫苗，必须改注射死疫苗。”',
        mechanism: '解剖学无脾、功能性无脾（如镰状细胞贫血、脾切除等）及持久性补体成分缺陷（C3、C5-C9等）患儿极易发生致命性荚膜细菌暴发性感染（OPSI）。需要特殊的 conjugate 结合疫苗强化接种程序，且必须注意 MenACWY-D 载体与 PCV 的免疫干扰效应。',
      });
    } else if (sub === 'ckd') {
      decisions.push({
        ruleId: 'q4_chronic_diseases',
        ruleTitle: '慢性肾脏病 (CKD)',
        code: 'yellow',
        title: '特殊高剂量乙肝免疫程序 & 活流感禁忌 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌。启动慢性肾脏病（CKD）高剂量/强化乙肝疫苗程序。',
        guidance: '慢性肾脏病患儿通常处于低应答状态。推荐常规疫苗足量接种，针对乙肝需定期复查 HBsAb，若抗体低下需接种高剂量（40mcg）或高佐剂乙肝疫苗重新完成接种。绝对禁止接种 LAIV 减毒活流感疫苗。',
        advice: '“有长期肾脏问题的孩子抵抗力弱，一旦感染重症风险高。但有些疫苗种类需要调整：比如绝对不能接种喷鼻流感活疫苗（需改注射型流感死疫苗）；且对于乙肝，由于身体产生的抗体容易衰减，需要定期抽血化验，必要时重新打加倍剂量的乙肝疫苗来维持保护力。”',
        mechanism: '慢性肾脏病患者免疫应答水平往往较低，HBV 感染风险及低应答概率增加，需要密切监测滴度并在需要时给予高剂量（40 mcg）强化。LAIV 含有活病毒，在慢性病患儿中可能产生异常复制风险。',
      });
    } else {
      decisions.push({
        ruleId: 'q4_chronic_diseases',
        ruleTitle: '长期服用阿司匹林或慢性基础病',
        code: 'yellow',
        title: '暂缓接种特定疫苗 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌！ 必须改为接种注射型灭活流感疫苗 (IIV)。',
        guidance: '有慢性基础疾病（心、肺、肾、代谢）或长期服用阿司匹林者，接种 LAIV 存在活病毒异常复制或诱发 Reye 综合征的理论风险。应改用灭活的 IIV 疫苗。',
        advice: '“有长期慢性基础疾病或长期在吃阿司匹林药片的孩子，千万不能喷鼻接种流感活疫苗。因为有引起严重并发症（脑病综合征）的理论可能。您只要改打注射型的流感死针（灭活流感疫苗）就是非常安全的，效果也很好。”',
        mechanism: '长期服用阿司匹林患者如果接种减毒活流感疫苗（LAIV），存在诱发 Reye\'s 综合征（一种急性的、可能致命的脑病合并内脏脂肪变性）的潜在临床物理和药理风险。改用灭活疫苗可安全规避此风险。',
      });
    }
  }

  // Rule 5: q5_wheezing_asthma_12m
  if (data.answers.q5_wheezing_asthma_12m && ageInMonths >= 24 && ageInMonths <= 59) {
    decisions.push({
      ruleId: 'q5_wheezing_asthma_12m',
      ruleTitle: '2-4岁患儿近12个月哮喘或喘息发作史',
      code: 'yellow',
      title: '暂缓/禁用喷鼻流感活疫苗 (Yellow Light)',
      action: '标记为减毒活流感疫苗 (LAIV) 的绝对禁忌。可安全注射灭活流感疫苗 (IIV)。',
      guidance: '患儿年龄介于24-59个月（2-4岁），且在过去12个月内有哮喘或喘息史，禁用 LAIV 鼻喷流感活疫苗。建议接种注射型灭活流感疫苗 (IIV) 保护气道。',
      advice: '“如果宝宝在过去 12 个月里有过喘息或哮喘发作，今天我们不能使用喷鼻流感活疫苗，因为这是一种活疫苗，可能会刺激受损的气道引起喘息。不过不用担心，宝宝完全可以、且非常需要接种注射型的流感死疫苗，它对气道非常安全，能提供同样的保护效果。”',
      mechanism: '减毒活流感病毒在受损或过度反应的气道上皮复制，可能直接诱发支气管痉挛或急性哮喘发作。而灭活疫苗（IIV）不具备在气道上皮复制的能力，安全可行。',
    });
  }

  // Rule 6: q6_intussusception
  if (data.answers.q6_intussusception) {
    decisions.push({
      ruleId: 'q6_intussusception',
      ruleTitle: '婴儿肠套叠史',
      code: 'red',
      title: '口服轮状病毒疫苗绝对禁忌 (Red Light)',
      action: '标记为口服轮状病毒减毒活疫苗 (RV1/RV5) 的绝对禁忌。',
      guidance: '记录绝对禁忌证档案。永久禁止口服轮状病毒减毒活疫苗。',
      advice: '“肠套叠（肠管套在一起引起的急腹症）是口服轮状病毒疫苗的绝对禁忌证。即使宝宝目前已经完全康复了，我们也不能再喂服轮状病毒疫苗，因为这会微弱地增加肠套叠复发的风险。我们会通过指导看护人勤洗手、注意饮食卫生等物理隔离手段来帮宝宝预防轮状病毒肠炎。”',
      mechanism: '既往有肠套叠史的婴儿在服用轮状病毒疫苗后，其肠道黏膜因减毒株复制产生的局部淋巴滤泡增生，在蠕动异常时可能会诱发或促进肠套叠的复发。',
    });
  }

  // Rule 7: q7_neurological_disorders
  if (data.answers.q7_neurological_disorders) {
    const sub = data.details.q7_subType || 'uncontrolled';
    if (sub === 'uncontrolled') {
      decisions.push({
        ruleId: 'q7_neurological_disorders',
        ruleTitle: '进行性或未控制的神经系统疾病',
        code: 'yellow',
        title: '含百日咳成分疫苗暂缓 (Yellow Light)',
        action: '标记为百日咳成分疫苗（DTaP/Tdap）的暂缓接种/慎用。推迟接种直至神经系统状况明确、稳定并建立治疗方案。',
        guidance: '1. 暂停含百日咳成分的接种。2. 对于小于7岁儿童，后续可改用白喉-破伤风（DT）联合疫苗；对于大于等于7岁患者，后续可使用 Td 完成接种。',
        advice: '“由于孩子的癫痫目前还没完全控制好，或者属于进行性的神经系统病变，为了安全起见，我们会先暂缓接种含百日咳成分的疫苗。我们会建议您等神经科医生帮孩子调整好药、病情稳定了，再来重新评估，或者用不含百日咳的疫苗（如白破二联疫苗）来替代。”',
        mechanism: '百日咳疫苗成分接种后可能诱发急性发热，在神经系统不稳定的患儿中可能诱发癫痫持续状态，或干扰对神经系统原发病进展的判断。需要病情稳定后方可接种或用白破二联（DT/Td）替代。',
      });
    } else if (sub === 'stable') {
      decisions.push({
        ruleId: 'q7_neurological_disorders',
        ruleTitle: '稳定的神经系统状况',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规接种。正常开展年龄适宜的预防接种。',
        guidance: '稳定的脑瘫、发育迟缓、已控制的癫痫等均不作为任何疫苗的禁忌。按期正常接种即可。',
        advice: '“我们需要看孩子的神经系统病变是‘稳定的’还是‘活动性的’。如果是稳定的脑瘫、发育迟缓，或者已经用药控制得很好的癫痫，打针是完全不受限的，必须按时打。这样能让孩子按时建立抗体保护。”',
        mechanism: '稳定的脑瘫、控制得当的惊厥个人史、发育迟缓等均属于稳定神经系统表现，接种疫苗并不会使原发疾病恶化，也无额外发热脑病风险。',
      });
    } else if (sub === 'history') {
      if (ageInMonths >= 12 && ageInMonths <= 47) {
        decisions.push({
          ruleId: 'q7_neurological_disorders',
          ruleTitle: '12-47月龄幼儿且有惊厥历史/家族史',
          code: 'green',
          title: '首剂 MMRV 慎用/建议拆分接种 (Green Light / Precaution)',
          action: '首剂 MMRV 的慎用指征。必须拆分为 MMR（麻腮风）+ 单价 VAR（水痘）分开接种，不宜使用四联联合疫苗。',
          guidance: '对于 12-47 个月且有个人或家族惊厥史的幼儿，接种首剂联合 MMRV 疫苗后 5-12 天内热性惊厥的发生率（约万分之9）显著高于分别接种 MMR 和 VAR（约万分之4）。强烈推荐拆开两针在不同部位或不同日期注射。',
          advice: '“如果宝宝、父母或者亲兄弟姐妹以前有过惊厥（抽搐）历史，在 12 至 47 个月打第一针麻腮风和水痘疫苗时，我们强烈建议不要打四联针（MMRV），而是建议拆成麻腮风和水痘两针分开打。这样能有效降低接种后发热引起抽搐的概率，对宝宝更安全。”',
          mechanism: '联合 MMRV 疫苗在首剂接种于 12-47 月龄时，比分别接种 MMR 和 VAR 诱发更高的发热峰值与热性惊厥发生率。分开注射可将此风险降低一半。',
        });
      } else {
        decisions.push({
          ruleId: 'q7_neurological_disorders',
          ruleTitle: '惊厥个人史或家属史',
          code: 'green',
          title: '准予接种 (Green Light)',
          action: '准予常规接种。接种后留观15-30分钟即可。',
          guidance: '惊厥个人史或家属史不是接种禁忌。正常接种。由于年龄未处于 12-47 月龄首剂 MMRV 窗口期，无此拆分约束。',
          advice: '“虽然以前有过惊厥或家人有过惊厥历史，但现在不属于危险年龄段或不影响当前常规疫苗，可以照常打。打完后多留观一会（如30分钟）就行。”',
          mechanism: '惊厥个人史或家族史在非高危窗口期不属于禁忌，正常接种加留观即可规避物理风险。',
        });
      }
    }
  }

  // Rule 8: q8_myocarditis_misc
  if (data.answers.q8_myocarditis_misc) {
    const sub = data.details.q8_subType || 'covid_vaccine_3w';
    if (sub === 'covid_vaccine_3w') {
      decisions.push({
        ruleId: 'q8_myocarditis_misc',
        ruleTitle: '接种新冠后3周内心肌炎或MIS-C史',
        code: 'yellow',
        title: '后续新冠疫苗暂缓 (Yellow Light / Precaution)',
        action: '标记为后续 COVID-19 疫苗的慎用/暂缓指征。推迟新冠接种，等心脏专科医生详细评估风险与收益。',
        guidance: '避免短期内接种后续新冠疫苗。需要专科彻底检查排除心肌炎活动病灶后再考虑是否接种。其他非新冠常规疫苗可以照常评估接种。',
        advice: '“如果宝宝以前的心肌炎或心包炎是在打新冠疫苗后 3 周内发生的，或者宝宝得过新冠病毒引起的全身多系统炎症综合征（MIS-C），为了安全起见，后续的新冠疫苗我们需要先暂缓，等心脏专科医生详细评估、确认心脏完全恢复后再考虑。其他常规疫苗不受此影响。”',
        mechanism: '主要为防范新冠 mRNA 疫苗接种后发生极罕见的心肌损伤/心包炎的累加风险或免疫级联反应。需谨慎评估。',
      });
    } else {
      decisions.push({
        ruleId: 'q8_myocarditis_misc',
        ruleTitle: '无关且完全康复的心肌炎',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规接种所有疫苗（包括新冠疫苗）。',
        guidance: '完全康复且与疫苗接种无关联的心肌炎不是禁忌，只要患儿目前处于正常活动状态，可照常完成常规和新冠接种。',
        advice: '“如果是和疫苗打针完全没有关系、而且现在已经完全好了、恢复正常活动的心肌炎，是可以安全接种新冠疫苗以及其他所有常规疫苗的，家长不用过于担心。”',
        mechanism: '与疫苗无关且已恢复的普通心肌炎患者并无持续的免疫敏感性，接种疫苗不会诱发复发，亦无额外累加伤害。',
      });
    }
  }

  // Rule 9: q9_immunodeficiency
  if (data.answers.q9_immunodeficiency) {
    const hasImmune = data.details.immuneTypes.length > 0;
    
    if (data.details.immuneTypes.includes('scid')) {
      decisions.push({
        ruleId: 'q9_immunodeficiency_scid',
        ruleTitle: 'SCID / T细胞缺陷 (绝对免疫缺陷)',
        code: 'cocooning',
        title: '绝对禁用减毒活疫苗 & 强烈启动家庭蚕茧接种方案 (Cocooning / Red Light)',
        action: '绝对禁用一切减毒活疫苗（如卡介苗、轮状病毒、麻腮风、水痘等）。 自身死疫苗极可能不产生应答。强制启动家庭“蚕茧接种方案” (Cocooning Strategy)！',
        guidance: '1. 自身禁止接种任何活疫苗。由于体液和细胞免疫极度受损，接种死疫苗通常也无应答。\n2. 强制动员其全部共同居住的家庭成员、看护人员及密切接触者补齐所有年龄段常规疫苗，且每年秋季必须接种灭活流感和新冠疫苗。\n3. 隔离约束：若同住婴儿服用口服轮状病毒疫苗，SCID 患儿在接种后 30 天内必须完全避免接触该婴儿粪便或参与更换尿布。',
        advice: '“因为宝宝患有严重的先天性免疫缺陷（严重联合免疫缺陷 SCID），绝对不能接种任何含有活病毒活细菌的‘减毒活疫苗’（如卡介苗、轮状活疫苗、麻腮风、水痘）。因为他的免疫系统无法像正常儿童一样压制和消灭疫苗里的弱病毒，打活针会导致全身严重的致命发病。此时宝宝吃普通的死针往往也建立不了足够抗体，最核心最有效的防护是‘蚕茧计划’：全家和所有亲密看护者必须打满流感和各种疫苗，在家中形成一道坚实的‘无菌安全隔离蚕茧’。”',
        mechanism: 'SCID 患儿缺乏功能性 T 细胞，无法清除减毒活疫苗病毒，会导致致命的播散性疫苗株感染。需通过隔离及周围人接种的‘蚕茧策略’阻断野生株及各种病毒的传入。',
      });
    }

    if (data.details.immuneTypes.includes('rituximab')) {
      decisions.push({
        ruleId: 'q9_immunodeficiency_rituximab',
        ruleTitle: '接受抗 CD20 单抗治疗 (利妥昔单抗)',
        code: 'yellow',
        title: '所有疫苗暂缓接种 (Yellow Light / Defer)',
        action: 'All_Vaccines = DEFER。暂缓一切非活疫苗和活疫苗的接种（均无免疫应答且存安全性隐患）。',
        guidance: '在治疗彻底结束满 6 至 9 个月且 CD19+ B 细胞计数恢复正常后，必须将患者视为从未接种过的“空白状态”从头启动全系列重新接种（Revaccination）。',
        advice: '“宝宝使用了清除 B 细胞的抗 CD20 单克隆抗体（如利妥昔单抗）。这导致他体内目前完全无法制造保护性的抗体，现在不管打什么疫苗都产生不了免疫力，打活针还有可能发生危险。所以今天任何针都不能打，要等到治疗彻底结束后再等 6-9 个月，等抽血看到 B 细胞数量恢复后，我们要把他当作一张‘白纸’，像新生儿一样一针针从头重打补齐所有疫苗。”',
        mechanism: '抗 CD20 单抗靶向清除 B 淋巴细胞，导致体液免疫功能在治疗期间及结束后数月内处于瘫痪状态，接种疫苗无法产生中和抗体，且活抗原可能难以被清除。',
      });
    }

    if (data.details.immuneTypes.includes('steroids')) {
      const w = parseFloat(data.details.steroid.weight) || 0;
      const d = parseFloat(data.details.steroid.dose) || 0;
      const dur = parseFloat(data.details.steroid.duration) || 0;

      if (dur >= 14 && (d >= 20 || (w > 0 && d / w >= 2.0))) {
        decisions.push({
          ruleId: 'q9_immunodeficiency_steroids_high',
          ruleTitle: `大剂量系统性糖皮质激素治疗 (持续 ${dur} 天)`,
          code: 'yellow',
          title: '减毒活疫苗绝对禁忌 (Yellow Light / Live Vaccines Red)',
          action: 'Live_Vaccines = ABSOLUTE_CONTRAINDICATION。在此大剂量免疫抑制应用期间绝对禁用一切减毒活疫苗。',
          guidance: '安全等待期：必须在激素完全停药满 1 个月（欧洲指南如爱尔兰 NIAC 推荐停药满 3 个月）后，方可再次评估并接种减毒活疫苗。非活/灭活死疫苗可正常接种，但免疫效果会打折扣。',
          advice: '“因为宝宝正在服用大剂量的糖皮质激素（强的松/泼尼松等），并且服药已经超过了2个星期。这会短时期内压抑身体的免疫防御。今天绝对不能给宝宝打任何含有活成分的减毒活疫苗。等疗程结束、完全停药满 1 个月以上，才能把活疫苗补种上；如果吃死针虽然安全，但打进去效果也很差，最好也等停药后再补打。”',
          mechanism: '全身大剂量应用糖皮质激素（剂量 >=2 mg/kg/天或每日剂量 >=20 mg 且持续 >=14 天）具有全身免疫抑制作用。需等待至少 1 个月洗脱其免疫抑制效应后方可注射注射型活疫苗。',
        });
      } else {
        decisions.push({
          ruleId: 'q9_immunodeficiency_steroids_low',
          ruleTitle: '低剂量或短疗程糖皮质激素治疗',
          code: 'green',
          title: '准予接种 (Green Light)',
          action: '准予接种。允许在停药后立即（或延迟 2 周）正常接种活疫苗。',
          guidance: '短疗程（<14天）或低剂量、局部吸入、外用糖皮质激素治疗不具有明显的全身免疫抑制作用。停药后即可接种活疫苗。',
          advice: '“因为宝宝吃激素的时间少于 14 天，或者剂量很小（或者仅仅是皮肤擦激素药膏、吸入哮喘气雾剂），这不会对全身免疫产生明显的压抑，所以在停药后可以直接、或者稍微等个 2 周就正常打针，不需要等待 1 个月。”',
          mechanism: '短疗程或生理维持量的糖皮质激素不会导致临床显著的系统性 T/B 细胞耗竭，停药后免疫状态迅速恢复，不构成活疫苗禁忌。',
        });
      }
    }

    if (data.details.immuneTypes.includes('sot')) {
      const phase = data.details.sot.phase || 'candidate';
      if (phase === 'candidate') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_sot_candidate',
          ruleTitle: '实体器官移植 (SOT) 候选人阶段',
          code: 'yellow',
          title: '移植术前候选特殊接种窗口 (Yellow Light)',
          action: '非活/灭活死疫苗必须在移植手术前至少 2 周完成接种；减毒活疫苗（MMR、单价 VAR）必须在移植手术前至少 4 周完成接种。减毒活流感疫苗 (LAIV) 绝对禁忌！',
          guidance: '1. 特例加速：对 6-11 个月龄的非免疫状态 SOT 候选儿，可提早接种首剂 MMR 和 VAR。但若接种后 12 个月龄前仍未移植，在未开始免疫抑制治疗前必须重新补种 1 剂。\n2. 做好移植前最后安全窗口的快速接种，一旦开始术后强抗排异将无法打活疫苗。',
          advice: '“由于宝宝目前正在等待进行器官移植，术后他需要长期服用强效抗排异药，免疫力会很低，将终生不能打活针。因此我们必须抢在手术和吃药前的‘黄金窗口’把疫苗打完：普通的死针要在手术前至少 2 个星期全部打完；而麻腮风、水痘这些活针，必须在手术前至少 4 个星期打完。如果是6-11个月的宝宝可以提前破例打一针活疫苗。喷鼻流感活疫苗是绝对不能打的。”',
          mechanism: '移植手术后由于需要强效抗排异（免疫抑制）治疗，患者机体将长期失去清除活病毒的能力。因此必须在术前安全窗口期（活疫苗 4 周，死疫苗 2 周）完成免疫，以获得足够保护屏障。',
        });
      } else if (phase === 'early') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_sot_early',
          ruleTitle: '实体器官移植后早期 (0-2 个月) 大剂量抗排异期',
          code: 'red',
          title: '极度免疫抑制绝对禁忌 (Red Light)',
          action: 'All_Vaccines = ABSOLUTE_CONTRAINDICATION。移植后早期大剂量强免疫抑制期，绝对禁止注射任何疫苗。',
          guidance: '1. 处于抗排异大剂量诱导期，完全禁止接种。\n2. 流感大流行特例：可在术后满 1 个月时，破例接种灭活流感疫苗 (IIV)。\n3. 强烈要求共同居住家属采取“蚕茧保护”。',
          advice: '“目前宝宝刚刚做完器官移植手术不满2个月，处于吃大剂量抗排异药的极度免疫抑制时期。这时候是绝对禁忌打任何疫苗的（除非流感大流行，术后满1个月可以破例接种流感死针）。此时宝宝极其娇贵，强迫打针也不会有任何保护，反而有严重危险。全家和密切接触者要尽快补齐常规疫苗，在家里给宝宝做‘蚕茧保护’。”',
          mechanism: '移植后前 2 个月是大剂量免疫抑制剂（如环孢素、他克莫司、激素、单抗等）诱导耐受的关键期，体液与细胞免疫被完全阻断，接种任何疫苗均属绝对禁忌并面临极高感染风险。',
        });
      } else if (phase === 'maintenance') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_sot_maintenance',
          ruleTitle: '实体器官移植后维持期 (术后 2-6 个月起)',
          code: 'yellow',
          title: '维持期灭活疫苗恢复 & 活疫苗长期禁忌 (Yellow Light)',
          action: '减毒活疫苗属于长期绝对禁忌！ 术后 2 至 6 个月起（视基线免疫抑制剂浓度平稳维持而定），可恢复常规非活/灭活死疫苗的接种。',
          guidance: '1. 乙肝滴度强制保护程序：定期复查 HBsAb。若 HBsAb 滴度 < 10 mIU/mL，必须使用加倍高剂量（40 mcg）或高佐剂乙肝疫苗重新完成接种。\n2. 活疫苗属于长期绝对禁忌。极个别在极低剂量或完全停用抗排异药、无排斥反应的肾/肝移植患儿，可在多学科及专科极其严密的监管下评估接种 MMR/VAR 的可能性。',
          advice: '“宝宝目前移植手术做完已经进入了平稳维持阶段（2-6个月以上），在这个时期，他的普通的死疫苗（如乙肝、百白破、灭活流感等）是可以逐步恢复打针的，因为他需要抵御疾病。但是！麻腮风、水痘这些减毒活疫苗属于长期的绝对禁忌，绝不能打。同时，因为吃抗排异药会影响乙肝疫苗的效果，我们需要定期抽血复查乙肝抗体，一旦抗体数值低于10，必须用正常孩子加倍的剂量（40微克）来重新重打，才能起到保护作用。”',
          mechanism: '维持期抗排异药降至平稳生理剂量，允许恢复常规灭活死疫苗的接种。但因患者处于长期免疫低反应状态，乙肝等高危传染病必须进行高剂量（40 mcg）注射与定期 HBsAb 滴度检测以确保不发生抗体漏网。活疫苗仍属长期禁忌。',
        });
      }
    }

    if (data.details.immuneTypes.includes('hsct')) {
      const isDonor = data.details.hsct.isDonor;
      const hsctPhase = data.details.hsct.phase;
      
      if (hsctPhase === 'donor') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_hsct_donor',
          ruleTitle: '造血干细胞移植 (HSCT) 供体阶段',
          code: 'yellow',
          title: '干细胞供体特殊接种规范 (Yellow Light)',
          action: '异体 HSCT 供体应在细胞采集前至少 10-14 天接种所需非活/灭活疫苗；在采集前至少 4 周完成活疫苗接种。',
          guidance: '供体接种必须严格控制时间，旨在规避活病毒减毒株通过移植的造血干细胞水平转染给免疫极其缺陷的患者的灾难性风险。',
          advice: '“作为造血干细胞的供体，您接种疫苗需要严格控制时间：必须在抽骨髓或采集细胞前 10-14 天打完需要的死疫苗，采集前至少 4 星期完成活疫苗（如水痘、麻腮风）。这是为了绝对防范疫苗里的活病毒留在血液里传给已经清髓、毫无抵抗力的患儿。”',
          mechanism: '供体体内接种减毒活疫苗后可能存在短暂病毒血症。若采集时间过近，活病毒可能伴随造血干细胞输入受体体内，在清髓后的受体体内疯狂复制，造成致命感染。',
        });
      } else if (hsctPhase === 'rebuilding') {
        const months = parseFloat(data.details.hsct.rebuildMonths) || 0;
        
        if (months < 3) {
          decisions.push({
            ruleId: 'q9_immunodeficiency_hsct_early',
            ruleTitle: `HSCT 清髓清空后早期 (术后 ${months} 个月)`,
            code: 'yellow',
            title: '清髓后早期极度受损期暂缓 (Yellow Light)',
            action: 'All_Vaccines = DEFER。移植后早期不满足任何接种重建条件，除流感暴发可在1个月破例接种灭活外，全部疫苗挂起暂缓。',
            guidance: '由于患儿原宿主骨髓与免疫系统被彻底摧毁，原有的主动免疫记忆彻底丧失，严禁在移植后 3 个月内开始任何常规疫苗重建。推荐全家强制启动“蚕茧接种方案”。',
            advice: '“宝宝刚刚完成造血干细胞移植不久，他的免疫功能目前等同于零，并且以前打过的所有疫苗记忆都被清空了，是一张完全没有保护的‘空白纸’。现在孩子太脆弱，不能打任何针。家人一定要把自己的疫苗打全来实施‘蚕茧式隔离保护’，等移植满 3-6 个月后，才能启动第一步的死疫苗重建。”',
            mechanism: 'HSCT 预处理会彻底摧毁患者骨髓和原有的免疫记忆。患者处于全无免疫的“空白状态”，需在造血重建、细胞系成成活后方可从头接种。',
          });
        } else {
          // General active rebuilding decision
          const conditions = data.details.hsct.clinicalConditions;
          const liveAllowed = months >= 24 && conditions.immunosuppressantsStopped3m && conditions.noActiveGVHD && conditions.bCellRecoveredIvigStopped3m;
          
          decisions.push({
            ruleId: 'q9_immunodeficiency_hsct_rebuilding',
            ruleTitle: `HSCT 术后主动免疫重建阶段 (第 ${months} 个月)`,
            code: 'yellow',
            title: '全系列主动免疫重建中 & 空白状态重打 (Yellow Light)',
            action: '原有主动免疫记忆彻底丧失，必须将患者视为从未接种过的“空白状态”从头启动全系列重新接种 (Revaccination)！',
            guidance: `【主动重建时间表执行中】：\n` +
                      `1. 肺炎链球菌重建：自移植后 ${months >= 3 && months <= 6 ? '3-6个月起开始' : '3-6个月'}, 连续接种 3 剂 PCV20 或 PCV15 (每剂间隔 4 周)。\n` +
                      `2. 肺炎多糖与 GVHD 评估：若无慢性GVHD，在移植后 12 个月可接种 1 剂 PPSV23。但因目前有【${data.details.hsct.hasGVHD === 'chronic' ? '慢性GVHD' : '无慢性GVHD'}】状况：` +
                      (data.details.hsct.hasGVHD === 'chronic' 
                        ? '【慢性GVHD】：绝对禁用多糖疫苗 PPSV23（应答极差且有未知风险），必须使用第四剂结合疫苗 PCV (PCV20/PCV15) 替代接种！\n' 
                        : '【无GVHD】：可以在移植满 12 个月后接种 1 剂 PPSV23（与前剂PCV间隔至少8周）。\n') +
                      `3. 灭活流感与新冠：在移植后满 3 至 4 个月即可提前接种（小于 9 岁且首次打流感者需打 2 剂，间隔 4 周）。\n` +
                      `4. 其他灭活疫苗：移植后 6 至 12 个月，且停止利妥昔单抗等 B 细胞耗竭剂 >= 6 个月以上，启动全系列从头重新补种。\n` +
                      `5. 减毒活疫苗 (MMR、VAR) 指征：移植必须满 24 个月，且必须满足3大专科硬性指标。当前评估为：` +
                      (liveAllowed 
                        ? '【符合条件，允许接种】：移植满24个月，且已停用激素/抗GVHD >=3个月，无活动性GVHD，且B细胞恢复、停IVIG >=3个月。可以安全接种 MMR 和 VAR。' 
                        : '【暂不符合，绝对禁忌】：尚不完全满足24个月或停药3个月、无活动排异等3项临床硬性条件。活疫苗必须无限期延迟，严禁接种！'),
            advice: `“由于宝宝做了造血干细胞移植（HSCT），他的骨髓和原有的免疫系统被彻底清空重置了。这意味着孩子像刚出生的婴儿一样，是一张‘空白纸’，以前打过的所有疫苗都失效了。我们必须从现在起，按照‘全系列主动重建原则’，把他当作从未打过针的孩子，一针针从头重打。目前第 ${months} 个月：非常适合连续打 3 针肺炎结合疫苗、流感死疫苗、新冠死疫苗... 但如果是麻腮风、水痘这些活针，必须在术后满24个月，且确认停抗排异药、停丙球满3个月，且没有排异反应才能打。”`,
            mechanism: 'HSCT 清髓摧毁了体液及细胞免疫记忆，导致原发抗体库彻底丧失。患者成活后必须进行 Revaccination 重建。多糖疫苗（如 PPSV23）在 GVHD 状态下不具备 T 细胞辅助应答，易导致抗体低应答及不良反应，应以 conjugate 疫苗替代。活疫苗重建对免疫力成熟度要求极高，必须遵守24个月及3项专科停药硬指标。',
          });
        }
      }
    }

    if (!hasImmune) {
      decisions.push({
        ruleId: 'q9_immunodeficiency_general',
        ruleTitle: '免疫系统缺陷 (一般评估)',
        code: 'red',
        title: '绝对禁用减毒活疫苗 (Red Light)',
        action: '绝对禁用一切减毒活疫苗。死疫苗可以正常开展，但抗体效果可能受限，且高度建议周围亲属实施“蚕茧接种”。',
        guidance: '凡具有临床免疫异常、原发性免疫缺陷、使用免疫抑制剂等，严禁接种减毒活疫苗。对于死/灭活疫苗可正常接种，但产生的中和抗体水平可能偏低。',
        advice: '“由于宝宝免疫系统受损，绝对不能接种含有活病毒活细菌的‘减毒活疫苗’。因为他的身体无法像正常孩子一样清除和限制弱病毒的复制，接种活疫苗容易发生极其严重的全身疫苗病。普通的死疫苗可以正常打，但效果会打折扣，因此最关键的是全家人要把各种常规和流感新冠疫苗打全，做好家庭无菌防护，建立蚕茧屏障。”',
        mechanism: '免疫受损机体存在严重的 T/B 淋巴细胞数量或功能缺陷，无法有效呈递疫苗抗原和限制活病毒减毒株的复制。活疫苗接种可能发生播散性致命感染；死疫苗不含复制成分安全，但由于反应路径受阻，主动免疫效率会打折扣。',
      });
    }
  }

  // Rule 10: q10_immunosuppressants_chemo
  if (data.answers.q10_immunosuppressants_chemo && !data.details.immuneTypes.includes('steroids') && !data.details.immuneTypes.includes('rituximab')) {
    decisions.push({
      ruleId: 'q10_immunosuppressants_chemo',
      ruleTitle: '免疫抑制剂/放化疗治疗史',
      code: 'yellow',
      title: '暂缓接种减毒活疫苗 (Yellow Light / Chemo)',
      action: '放化疗、使用强效免疫抑制剂期间绝对禁用减毒活疫苗。死/灭活疫苗可以接种，但中和抗体产生极其低下，建议推迟。',
      guidance: '1. 大剂量泼尼松等激素疗程：必须在疗程结束停药满 1 个月后方可补打活疫苗。\n2. 肿瘤放化疗患儿：必须等全部放化疗彻底结束满 3 个月以上，由血液肿瘤科专科医生评估免疫功能（如 T/B 细胞亚群、Ig 浓度）完全恢复后，方可启动活疫苗补种。',
      advice: '“化疗、放疗或服用大剂量免疫抑制药物会极大地压制孩子的免疫系统。在治疗期间，绝对不能打含有活病毒的减毒活疫苗。如果是大剂量吃激素，停药满 1 个月后可以补打活疫苗；如果是肿瘤化疗，必须等到化疗完全结束、满 3 个月以上，并且等血液肿瘤科的医生抽血评估免疫力完全合格后，才能把疫苗重新补种上去。治疗期间打死疫苗虽然安全但几乎没效果，因此一般建议全部停药后再统一补齐。”',
      mechanism: '外源性化疗和免疫抑制剂药物能够强烈杀伤增殖的 T/B 淋巴细胞，导致全身免疫分支处于低功能状态，接种活疫苗具有严重播散复制风险，接种死疫苗则无法建立特异性免疫记忆。',
    });
  }

  // Rule 11: q11_family_immunodeficiency
  if (data.answers.q11_family_immunodeficiency) {
    decisions.push({
      ruleId: 'q11_family_immunodeficiency',
      ruleTitle: '先天性免疫缺陷家族史',
      code: 'yellow',
      title: '暂缓接种卡介苗/轮状/麻腮风/水痘等活疫苗 (Yellow Light)',
      action: '标记为卡介苗 (BCG)、轮状病毒疫苗 (RV1/RV5)、麻腮风 (MMR)、水痘 (VAR/MMRV) 疫苗的暂缓接种/慎用。推迟接种，直至临床证实该婴儿自身的免疫功能完全正常。',
      guidance: '必须由临床医生开具血液免疫学检查（如 TREC 筛查、KREC 筛查或基因检测）。一旦证实患儿自身无免疫缺陷，可安全、正常地按期完成常规预防接种。',
      advice: '“如果宝宝的爸爸、妈妈或者哥哥姐姐有先天性的免疫缺陷（例如严重联合免疫缺陷 SCID），在宝宝出生早期，我们绝对不能急着给孩子打卡介苗、轮状病毒、麻腮风和水痘疫苗。因为部分严重的免疫缺陷病是会遗传给宝宝的，孩子可能还在‘无症状潜伏期’。我们建议必须先给宝宝做详细的血液免疫学检查（如 TREC 筛查或基因检测），等临床医生确诊宝宝自身的免疫系统完全健康后，才能开始打这些活疫苗。在此之前，家属应先完成自身接种以保护孩子。”',
      mechanism: '部分严重联合免疫缺陷等疾病具有常染色体隐性或 X-染色体连锁遗传模式。在新生儿期或早期尚未表现出重度感染时，盲目接种活疫苗（如卡介苗、轮状病毒）会导致严重的疫苗株致命扩散。必须先行 TREC/KREC/基因筛查以完全排除患病可能。',
    });
  }

  // Rule 12: q12_blood_products_antivirals
  if (data.answers.q12_blood_products_antivirals && data.details.bloodType) {
    const calc = calculateDelayDate(data.details.bloodType, data.details.bloodDate);
    const months = ANTIBODY_DATA[data.details.bloodType]?.wait || 0;
    
    if (months > 0) {
      decisions.push({
        ruleId: 'q12_blood_products_antivirals',
        ruleTitle: `血液制品/抗体暴露史 (${ANTIBODY_DATA[data.details.bloodType]?.name})`,
        code: 'yellow',
        title: '暂缓接种注射型减毒活疫苗 (Yellow Light / Washout Period)',
        action: '标记为注射型活疫苗（MMR、VAR、MMRV）的暂缓接种。推迟至安全洗脱期满后再进行接种。口服轮状病毒疫苗 (RV) 和 RSV 单克隆抗体不受系统循环 IgG 干扰，可随时或同日接种。',
        guidance: `安全洗脱期：输注 ${ANTIBODY_DATA[data.details.bloodType]?.name} 后，必须强制等待至少 ${months} 个月（洗脱期）方可接种 MMR/VAR。\n` +
                  (calc ? `- 推荐补种起始日期：${calc.date} (需满 ${months} 个月洗脱期)。\n` : '') +
                  (data.details.bloodPostVaccine14d ? `【警示】：由于您在接种 MMR/VAR 活疫苗后的 14 天最短复制期内被迫输注了血液制品，先前的接种已被判定为【无效接种】，必须在此安全洗脱期满后完全重新补种该剂次。` : ''),
        advice: `“由于宝宝近期输过含大量抗体的血液制品（如 ${ANTIBODY_DATA[data.details.bloodType]?.name}），这些外源性抗体会像‘保镖’一样把我们打进去的麻腮风、水痘疫苗里的弱病毒中和消灭掉，导致孩子自己没法产生长效抗体。因此，我们必须等待至少 ${months} 个月的‘抗体洗脱期’，等外源抗体消退了，再来补打活疫苗。` +
                (calc ? `推荐在 ${calc.date} 以后补种。` : '') +
                (data.details.bloodPostVaccine14d ? ` 因为您是在接种后14天内输过丙球/血的，说明上一次的打针失效了，等洗脱期满后必须重新重打一针。` : '') +
                `不过普通的死疫苗以及口服的轮状活疫苗完全不受影响，今天可以正常接种。”`,
        mechanism: '外源性被动 IgG 抗体在血循环中持续存在，特异性中和注射的减毒活疫苗病毒（MMR、VAR），阻断其自主复制与抗原呈递，导致主动免疫建立失败。因此必须等待其抗体衰减洗脱。口服轮状在消化道局部增殖，不受循环中 IgG 影响；RSV 单抗仅有单一中和靶点，不干扰多价活疫苗复制。',
      });
    } else {
      decisions.push({
        ruleId: 'q12_blood_products_antivirals',
        ruleTitle: '血液制品/抗体暴露史 (洗涤红细胞)',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予正常接种注射型活疫苗和死疫苗。无需设置等待间隔。',
        guidance: '洗涤红细胞中几乎不含有血浆抗体成分，不产生疫苗中和干扰。正常程序接种即可。',
        advice: '“由于宝宝输注的是洗涤红细胞，里面多余的血浆抗体已经被冲洗干净了，不会干扰疫苗效果，所以不需要等待，今天可以直接正常打麻腮风、水痘等所有常规疫苗。”',
        mechanism: '洗涤红细胞（Washed RBCs）中血浆成分极微，循环中被动抗体浓度几乎为零，不影响注射型活疫苗毒株的主动复制与抗体产生。不构成接种限制。',
      });
    }
  }

  // Rule 13: q13_pregnancy
  if (data.answers.q13_pregnancy) {
    decisions.push({
      ruleId: 'q13_pregnancy',
      ruleTitle: '患者处于妊娠状态',
      code: 'red',
      title: '减毒活疫苗及 HPV 疫苗绝对禁忌 (Red Light)',
      action: '绝对禁用所有减毒活疫苗 (MMR、VAR、MMRV、LAIV)。HPV 疫苗不推荐接种。孕期推荐安全接种百破（Tdap）及灭活流感死针。',
      guidance: '1. 记录绝对禁忌证档案。2. 指导青少年女性接种活疫苗后 1 个月内应采取严格避孕措施。3. 意外接种者通常不作为终止妊娠的指征，但应及时告知产科医生进行随访监护。4. 死/灭活疫苗（如 Tdap、灭活流感等）在孕期可安全接种。',
      advice: '“孕期是绝对不能打麻腮风、水痘、鼻喷流感等活疫苗的，因为活疫苗里的弱病毒理论上存在通过胎盘传染给胎儿的风险，有造成先天性畸形的可能。同时，HPV 疫苗在怀孕期间也是不推荐打的。打完活疫苗后请做好1个月内避孕。如果在不知道怀孕的情况下不小心打过了，一般也不用惊慌终止妊娠，及时到产科随访检查就行。”',
      mechanism: '处于妊娠状态时，全身系统免疫呈一定生理耐受改变，且活疫苗株可能在高度增殖的胎盘、蜕膜组织中进行自主复制并发生母婴垂直水平传播，存在致畸或流产的理论风险。常规死疫苗不具自我复制能力，安全推荐。',
    });
  }

  // Rule 14: q14_recent_vaccines_4w
  if (data.answers.q14_recent_vaccines_4w) {
    decisions.push({
      ruleId: 'q14_recent_vaccines_4w',
      ruleTitle: '近期 4 周减毒活疫苗接种史',
      code: 'yellow',
      title: '暂缓接种注射型活疫苗 (Yellow Light / Live Interval)',
      action: '若两种注射型减毒活疫苗（或 LAIV）非同天接种，必须强制间隔至少 28 天 (4 周)。',
      guidance: '暂停注射型活疫苗。若上次接种注射型活疫苗（或 LAIV）至今不足 28 天，今日必须推迟接种另一种注射型活疫苗。非活/灭活疫苗之间、非活与活疫苗之间接种无任何限制。',
      advice: '“如果宝宝在过去 4 周内打过需要注射的‘减毒活疫苗’（比如上周刚打了水痘疫苗，这周想打麻腮风），由于第一种活疫苗在体内引起的免疫干扰会削弱第二种疫苗的效果，我们今天必须暂缓，等间隔满 28 天再打。但如果上次打的是死疫苗（如百白破、乙肝、流感针、肺炎结合疫苗等），或者今天想接种死疫苗，则完全没有这个 4 周的限制，随时可以打。”',
      mechanism: '非同天接种的第一种活疫苗阻断诱导产生的干扰素（IFN-alpha 等）等非特异性抗病毒应答，会在接种后数天至数周内瞬时抑制和干扰第二种活病毒在体内的自主复制与表达，造成第二种疫苗免疫建立失败。同天接种或间隔满 28 天则可避免此干扰。',
    });
  }

  // Rule 15: q15_syncope_history
  if (data.answers.q15_syncope_history) {
    decisions.push({
      ruleId: 'q15_syncope_history',
      ruleTitle: '晕针/迷走神经反射史',
      code: 'green',
      title: '常规保护指征 (Green Light / Precaution)',
      action: '不属于接种禁忌。准予常规接种，但必须采取临床防晕针物理常规监护措施。',
      guidance: '1. 必须要求患儿采取坐位或仰卧位进行接种，避免空腹接种。\n2. 接种后必须在诊室或接种点强制平卧或静坐留观至少 15 分钟（加强留观）。\n3. 医护人员应做好体位防护，防范因瞬间脑供血不足摔倒受伤。',
      advice: '“有些孩子（尤其是十几岁的大孩子）在打针时由于紧张，容易心慌、头晕，甚至晕过去。这完全不是疫苗成分有毒或副作用，而是由于高度紧张引起的正常迷走神经反射。请您和孩子放心，我们今天会让孩子坐着或者平躺着接种，避免空腹，并且在打完针后在诊室里静坐观察 15 分钟。这样可以完全避免因头晕摔倒受伤。接种前可以跟孩子多聊聊天、分散注意力。”',
      mechanism: '晕针（血管迷走神经性晕厥）是由情绪紧张、焦虑或疼痛刺激激发自主神经失调，导致心率和血压瞬间降低、脑供血不足。不涉及疫苗组分免疫反应，属于物理安全防护。',
    });
  }

  // Rule 16: q16_anxiety
  if (data.answers.q16_anxiety) {
    decisions.push({
      ruleId: 'q16_anxiety',
      ruleTitle: '接种焦虑',
      code: 'green',
      title: '舒缓接种护理指征 (Green Light / Precaution)',
      action: '不属于禁忌证。准予正常接种。启动无痛/非药物舒缓接种护理指征。',
      guidance: '1. 指导家长在接种时温和抱紧、安抚孩子，禁止使用恐吓性语言（如“不听话就让医生给你打针”）。\n2. 推荐接种时配合注意力分散技巧（如吹哨子、故意咳嗽、轻敲皮肤、环抱毛绒玩具等）以舒缓压力、减轻疼痛感知。',
      advice: '“害怕打针、抗拒针头是孩子们非常普遍且正常的表现。我们会通过温和的引导、分心方法（比如让宝宝吹哨子、咳嗽、抱紧毛绒玩具）来帮宝宝度过这一关。请家长在接种时温柔抱紧孩子，避免用恐吓的语言（如‘不听话就让医生给你打针’）来强化孩子的恐惧，我们一起配合，让宝宝在一个轻松、有安全感的环境里完成接种。”',
      mechanism: '接种焦虑是由急性恐惧与针头恐惧（Trypanophobia）引起的。通过非药物心理抚慰与触觉分心方法，可显著抑制大脑痛觉皮质的反应阈值，减少阻抗并提高护理安全性。',
    });
  }

  // Rule F: Preemie & LBW check (Automatic rule based on age and preemie pseudo flag)
  if (data.details.isPseudo.includes(2)) { // Preemie tag in pseudo list
    // Check if preterm/LBW NICU rules trigger
    if (data.details.currentLocation === 'nicu' && ageInMonths >= 1.5) { // chronological age >= 6 weeks (1.5 months)
      decisions.push({
        ruleId: 'q_preemie_nicu',
        ruleTitle: '早产儿/低出生体重儿住院 NICU 期间',
        code: 'red',
        title: 'NICU 期间轮状病毒活疫苗绝对禁忌 (Red Light)',
        action: 'Live_Rotavirus_Vaccine = ABSOLUTE_CONTRAINDICATION。住院期间严禁在病房内口服轮状病毒疫苗。',
        guidance: 'Action: Defer RV vaccination until the day of hospital discharge or later。防止减毒株经粪便排出水平传播给 NICU 病房内其他极度脆弱的新生儿。常规死疫苗若病情稳定必须按实足年龄正常接种。',
        advice: '“因为宝宝目前还在新生儿监护室（NICU）住院治疗，虽然他的实足年龄已经满足了打轮状病毒疫苗的条件，但由于轮状病毒疫苗是口服减毒活疫苗，接种后病毒会通过粪便排出，容易在密闭脆弱的 NICU 病房里传播感染其他极其危重的宝宝。所以住院期间绝对不能吃这个药，必须等出院回家当天或出院后才能补种。其他普通的死疫苗若宝宝情况稳定，必须按出生后的实足年龄正常打，不能打折。”',
        mechanism: '早产儿及低体重儿病情稳定后应按实足年龄（Chronological Age）接种。但由于口服轮状减毒活疫苗会在肠道内复制并经由粪便排出，在 NICU 密闭环境中极易发生患者间水平交叉感染，对其他极脆弱早产儿造成致死性胃肠炎风险。故 NICU 住院期禁用，待出院方可接种。',
      });
    }
  }

  // Determine overall summary level
  let level: Report['level'] = 'green';
  if (decisions.some(d => d.code === 'cocooning')) {
    level = 'cocooning';
  } else if (decisions.some(d => d.code === 'red')) {
    level = 'red';
  } else if (decisions.some(d => d.code === 'yellow')) {
    level = 'yellow';
  }

  // If no decision added (meaning all answers were NO and child is completely healthy)
  if (decisions.length === 0) {
    decisions.push({
      ruleId: 'healthy',
      ruleTitle: '常规健康儿童筛查',
      code: 'green',
      title: '准予接种 (Green Light)',
      action: '无任何绝对禁忌与慎用。按照年龄适宜的常规一类/二类预防接种程序实施。',
      guidance: '接种后必须在接种点平卧或静坐强制留观 15 至 30 分钟，严防防范极罕见的急性过敏反应发生。',
      advice: '“评估结果显示宝宝目前的身体状况一切正常，没有发现任何疫苗接种的禁忌症。建议按计划接种当前月龄/年龄应该打的疫苗。打完针后，请务必在留观室安静观察 30 分钟，确保宝宝没有任何不舒服再回家哦！”',
      mechanism: '临床前置筛查未发现致敏抗原、免疫受损、干扰因子等风险因素，患儿免疫屏障完好，接种常规和非一类疫苗安全且获益巨大。',
    });
  }

  // Generate a beautiful markdown or text-based summary of clinical recommendation
  let overallSummary = '';
  if (level === 'cocooning') {
    overallSummary = `评估结论：【蚕茧免疫 / Cocooning Strategy】。患儿由于存在极重度原发性免疫缺陷（如SCID），自身禁止接种任何减毒活疫苗，且由于免疫应答极其低下，死疫苗接种可能无应答。必须强制全家及共同居住者建立蚕茧式接种，全员打齐流感及新冠灭活等疫苗以切断野生株传播。`;
  } else if (level === 'red') {
    overallSummary = `评估结论：【绝对禁忌 / Red Light】。发现患儿存在特定的疫苗绝对禁忌症（如既往疫苗严重过敏休克、肠套叠史、或妊娠等），必须永久或长期取消接种对应疫苗。需将禁忌记入电子档案，改用其他抗原或物理保护措施，周围人需加强接种形成群落保护。`;
  } else if (level === 'yellow') {
    overallSummary = `评估结论：【暂缓接种 / Yellow Light】。发现患儿目前处于急性期、神经系统不稳定期、或尚处于大剂量应用激素、放化疗、输注血液制品的安全洗脱等待期中。当前不宜开展特定或全部接种。请遵医嘱在安全期满或病情平稳后，尽快开展补种或追赶接种。`;
  } else {
    overallSummary = `评估结论：【准予接种 / Green Light】。患儿无绝对禁忌与慎用，或仅存在稳定的脑瘫、发育迟缓、控制良好的癫痫等不阻碍接种的情况。请按计划接种，接种后需严格进行 15-30 分钟常规物理留观，防范晕针或罕见过敏。`;
  }

  return {
    level,
    decisions,
    overallSummary,
  };
};
