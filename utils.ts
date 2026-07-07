import { AssessmentData, Report, DecisionItem, AntibodyInfo, ConflictTip } from './types';
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

  // ==================== Rule 1: q1_acute_illness ====================
  if (data.answers.q1_acute_illness) {
    const sub = data.details.q1_subType || 'severe';
    if (sub === 'severe') {
      decisions.push({
        ruleId: 'q1_acute_illness_severe',
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
        ruleId: 'q1_acute_illness_mild',
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

  // ==================== Rule 2: q2_severe_allergies ====================
  if (data.answers.q2_severe_allergies) {
    const sub = data.details.q2_subType || 'severe';
    if (sub === 'severe') {
      decisions.push({
        ruleId: 'q2_severe_allergies_severe',
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
        ruleId: 'q2_severe_allergies_mild',
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

  // ==================== Rule 3: q3_past_severe_reaction ====================
  if (data.answers.q3_past_severe_reaction) {
    const sub = data.details.q3_subType || 'anaphylaxis';
    if (sub === 'anaphylaxis') {
      decisions.push({
        ruleId: 'q3_past_severe_reaction_severe',
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
        ruleId: 'q3_past_severe_reaction_mild',
        ruleTitle: '既往 DTaP 接种后非特异反应',
        code: 'yellow',
        title: '慎用/需谨慎评估 (Yellow Light / Precaution)',
        action: '作为后续 DTaP（百白破成分疫苗）的慎用指征。临床医生需详细评估风险与收益，决定是否接种或用其他方案替代。',
        guidance: '若既往接种 DTaP 后 48 小时内出现：发热 ≥ 40.5℃、持续 ≥ 3 小时无法抚慰的哭闹、低张性低反应性发作（HHE），或 3 天内发生惊厥，标记为后续 DTaP 的慎用指征。需评估风险与收益。',
        advice: '“如果宝宝以前打完百白破仅仅是打针的地方有些红肿、发硬、或者出现过中低烧、哭闹，这些是正常免疫反应。但如果出现过高烧、抽搐，再次打含百白破的疫苗时需要医生慎重评估。接种后我们会加强留观，请您放心。”',
        mechanism: '严重的全身过敏反应是绝对禁忌。而既往 DTaP 接种后的高热、HHE、惊厥在现代临床中已被降级为慎用指征，不作为绝对禁忌，但在再次接种时仍需密切防范和监护。',
      });
    }
  }

  // ==================== Rule 4: q4_chronic_diseases ====================
  if (data.answers.q4_chronic_diseases) {
    const sub = data.details.q4_subType || 'chronic_aspirin';
    if (sub === 'asplenia') {
      decisions.push({
        ruleId: 'q4_chronic_diseases_asplenia',
        ruleTitle: '无脾或功能性无脾/补体缺陷 (分支 C)',
        code: 'yellow',
        title: '需特殊强化接种程序 & 活疫苗限制 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌！ 启动分支 C (无脾/补体缺陷) 强化结合疫苗接种路径。',
        guidance: '1. 肺炎链球菌结合疫苗强化：小于2岁常规完成4剂PCV基础接种。大于等于2岁既往未接种PCV20的无脾患儿，若既往仅接种过PCV13/15，补种1剂次PCV20，或接种1剂次PPSV23（间隔>=8周，5年后重种第二剂）。\n2. 脑膜炎球菌结合疫苗强化：自2个月龄起启动MenACWY基础系列。若首剂年龄 < 7岁，每3年定期加强1剂；若首剂年龄 >= 7岁，每5年定期加强1剂。自10岁起常规完成2剂次MenB基础免疫。\n3. 无脾儿 Hib 疫苗强化：对大于等于5岁且从未接种过Hib的无脾儿童，补种1剂次单价Hib结合疫苗。\n4. MenACWY-D (Menactra) 与 PCV 免疫干扰规避：若患儿有无脾或HIV且同时需要PCV and MenACWY-D，先完成所有PCV，且至少间隔4周后再接种MenACWY-D（优先推荐使用非白喉载体脑膜炎疫苗以规避干扰）。',
        advice: '“由于宝宝没有脾脏、镰状细胞贫血或有补体缺陷，身体对特定细菌（如肺炎球菌、脑膜炎球菌、Hib流感嗜血杆菌）的抵抗力会非常差，极易发生致命性的暴发性感染。因此，孩子更急需接种专门的强化疫苗程序来提高抗体水平。另外，绝对不能使用喷鼻流感活疫苗，必须改注射死疫苗。”',
        mechanism: '解剖学无脾、功能性无脾（如镰状细胞贫血、脾切除等）及持久性补体成分缺陷患儿极易发生致命性脑膜炎和肺炎链球菌暴发性感染（OPSI）。需要特殊的结合疫苗强化程序。',
      });
    } else if (sub === 'ckd') {
      decisions.push({
        ruleId: 'q4_chronic_diseases_ckd',
        ruleTitle: '慢性肾脏病 (CKD)',
        code: 'yellow',
        title: '特殊高剂量乙肝免疫程序 & 活流感禁忌 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌。启动慢性肾脏病（CKD）高剂量/强化乙肝疫苗程序。',
        guidance: '慢性肾脏病患儿通常处于低应答状态。推荐常规疫苗足量接种，针对乙肝需定期复查 HBsAb，若抗体低下需接种高剂量（40mcg）或高佐剂乙肝疫苗重新完成接种。绝对禁止接种 LAIV 减毒活流感疫苗。',
        advice: '“有长期肾脏问题的孩子抵抗力弱，一旦感染重症风险高。但有些疫苗种类需要调整：比如绝对不能接种喷鼻流感活疫苗（需改注射型流感死疫苗）；且对于乙肝，由于身体产生的抗体容易衰减，需要定期复查，必要时重新打加倍剂量的乙肝疫苗来维持保护力。”',
        mechanism: '慢性肾脏病患者免疫应答水平往往较低，HBV 感染风险及低应答概率增加，需要密切监测并在需要时给予高剂量（40 mcg）强化。',
      });
    } else {
      decisions.push({
        ruleId: 'q4_chronic_diseases_aspirin',
        ruleTitle: '长期服用阿司匹林或慢性基础病',
        code: 'yellow',
        title: '暂缓接种特定疫苗 (Yellow Light)',
        action: 'LAIV (减毒活流感疫苗) 绝对禁忌！ 必须改为接种注射型灭活流感疫苗 (IIV)。',
        guidance: '有慢性基础疾病（心、肺、肾、代谢）或长期服用阿司匹林者，接种 LAIV 存在活病毒异常复制或诱发 Reye 综合征的理论风险。应改用灭活的 IIV 疫苗。',
        advice: '“有长期慢性基础疾病或长期在吃阿司匹林药片的孩子，千万不能喷鼻接种流感活疫苗。因为有引起严重并发症（脑病综合征）的理论可能。您只要改打注射型的流感死针（灭活流感疫苗）就是非常安全的。”',
        mechanism: '长期服用阿司匹林患者如果接种减毒活流感疫苗（LAIV），存在诱发 Reye\'s 综合征的潜在药物学交互风险。',
      });
    }
  }

  // ==================== Rule 5: q5_wheezing_asthma_12m ====================
  if (data.answers.q5_wheezing_asthma_12m && ageInMonths >= 24 && ageInMonths <= 59) {
    decisions.push({
      ruleId: 'q5_wheezing_asthma_12m',
      ruleTitle: '2-4岁患儿近12个月哮喘或喘息发作史',
      code: 'yellow',
      title: '暂缓/禁用喷鼻流感活疫苗 (Yellow Light)',
      action: '标记为减毒活流感疫苗 (LAIV) 的绝对禁忌。可安全注射灭活流感疫苗 (IIV)。',
      guidance: '患儿年龄介于24-59个月（2-4岁），且在过去12个月内有哮喘或喘息史，禁用 LAIV 鼻喷流感活疫苗。建议接种注射型灭活流感疫苗 (IIV) 保护气道。',
      advice: '“如果宝宝在过去 12 个月里有过喘息或哮喘发作，今天我们不能使用喷鼻流感活疫苗，因为这是一种活疫苗，可能会刺激受损的气道。不过不用担心，宝宝完全可以接种注射型的流感死疫苗，它对气道非常安全。”',
      mechanism: '减毒活流感病毒在受损或过度反应的气道上皮复制，可能直接诱发支气管痉挛或急性哮喘发作。',
    });
  }

  // ==================== Rule 6: q6_intussusception ====================
  if (data.answers.q6_intussusception) {
    decisions.push({
      ruleId: 'q6_intussusception',
      ruleTitle: '婴儿肠套叠史',
      code: 'red',
      title: '口服轮状病毒疫苗绝对禁忌 (Red Light)',
      action: '标记为口服轮状病毒减毒活疫苗 (RV1/RV5) 的绝对禁忌。',
      guidance: '记录绝对禁忌证档案。永久禁止口服轮状病毒减毒活疫苗。',
      advice: '“肠套叠是口服轮状病毒疫苗的绝对禁忌证。即使宝宝目前已经完全康复了，我们也不能再喂服轮状病毒疫苗，因为这会增加肠套叠复发的风险。我们会指导您在生活中勤洗手来帮宝宝做日常防护。”',
      mechanism: '既往有肠套叠史的婴儿在服用轮状病毒疫苗后，其肠道黏膜因减毒株复制产生的局部淋巴滤泡增生，蠕动异常时可能会促进肠套叠的复发。',
    });
  }

  // ==================== Rule 7: q7_neurological_disorders ====================
  if (data.answers.q7_neurological_disorders) {
    const sub = data.details.q7_subType || 'uncontrolled';
    if (sub === 'uncontrolled') {
      decisions.push({
        ruleId: 'q7_neurological_disorders_uncontrolled',
        ruleTitle: '进行性或未控制的神经系统疾病',
        code: 'yellow',
        title: '含百日咳成分疫苗暂缓 (Yellow Light)',
        action: '标记为百日咳成分疫苗（DTaP/Tdap）的暂缓接种/慎用。推迟接种直至神经系统状况明确、稳定并建立治疗方案。',
        guidance: '1. 暂停含百日咳成分的接种。2. 对于小于7岁儿童，后续可改用白喉-破伤风（DT）联合疫苗；对于大于等于7岁患者，后续可使用 Td 完成接种。',
        advice: '“由于孩子的癫痫目前还没完全控制好，或者属于进行性的神经系统病变，为了安全起见，我们会先暂缓接种含百日咳成分的疫苗。等神经科医生帮孩子调整好药、病情稳定了，再来重新评估，或者用不含百日咳的疫苗（如白破二联疫苗）来替代。”',
        mechanism: '百日咳疫苗成分接种后可能诱发急性发热，在神经系统不稳定的患儿中可能诱发癫痫持续状态。',
      });
    } else if (sub === 'stable') {
      decisions.push({
        ruleId: 'q7_neurological_disorders_stable',
        ruleTitle: '稳定的神经系统状况',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规接种。正常开展年龄适宜的预防接种。',
        guidance: '稳定的脑瘫、发育迟缓、已控制的癫痫等均不作为任何疫苗的禁忌。按期正常接种即可。',
        advice: '“如果孩子是稳定的脑瘫、发育迟缓，或者已经用药控制得很好的癫痫，打针是完全不受限的，必须按时打。这样能让孩子按时建立抗体保护。”',
        mechanism: '稳定的脑瘫、控制得当的惊厥个人史、发育迟缓等均属于稳定神经系统表现，接种疫苗并不会使原发疾病恶化，也无额外发热脑病风险。',
      });
    } else if (sub === 'history') {
      if (ageInMonths >= 12 && ageInMonths <= 47) {
        decisions.push({
          ruleId: 'q7_neurological_disorders_history_mrv',
          ruleTitle: '12-47月龄幼儿且有惊厥历史/家族史',
          code: 'green',
          title: '首剂 MMRV 慎用/建议拆分接种 (Green Light / Precaution)',
          action: '首剂 MMRV 的慎用指征。必须拆分为 MMR（麻腮风）+ 单价 VAR（水痘）分开接种，不宜使用四联联合疫苗。',
          guidance: '对于 12-47 个月且有个人或家族惊厥史的幼儿，接种首剂联合 MMRV 疫苗后热性惊厥的发生率显著高于分别接种 MMR 和 VAR。强烈推荐拆开两针在不同部位或不同日期注射。',
          advice: '“如果宝宝、父母或者亲兄弟姐妹以前有过惊厥历史，在 12 至 47 个月打第一针麻腮风和水痘疫苗时，我们强烈建议不要打四联针（MMRV），而是拆成麻腮风和水痘两针分开打。这样能有效降低接种后抽搐的概率。”',
          mechanism: '联合 MMRV 疫苗在首剂接种于 12-47 月龄时，比分别接种 MMR 和 VAR 诱发更高的发热峰值与热性惊厥发生率。分开注射可将此风险降低一半。',
        });
      } else {
        decisions.push({
          ruleId: 'q7_neurological_disorders_history_normal',
          ruleTitle: '惊厥个人史或家属史',
          code: 'green',
          title: '准予接种 (Green Light)',
          action: '准予常规接种。接种后留观15-30分钟即可。',
          guidance: '惊厥个人史或家属史不是接种禁忌。正常接种。由于年龄未处于 12-47 月龄首剂 MMRV 窗口期，无此拆分约束。',
          advice: '“虽然以前有过惊厥或家人有过惊厥历史，但现在已经不处于高风险年龄段，可以照常打。打完后多留观一会就行。”',
          mechanism: '惊厥个人史或家族史在非高危窗口期不属于禁忌，正常接种加留观即可。',
        });
      }
    }
  }

  // ==================== Rule 8: q8_myocarditis_misc ====================
  if (data.answers.q8_myocarditis_misc) {
    const sub = data.details.q8_subType || 'covid_vaccine_3w';
    if (sub === 'covid_vaccine_3w') {
      decisions.push({
        ruleId: 'q8_myocarditis_misc_covid',
        ruleTitle: '接种新冠后3周内心肌炎或MIS-C史',
        code: 'yellow',
        title: '后续新冠疫苗暂缓 (Yellow Light / Precaution)',
        action: '标记为后续 COVID-19 疫苗的慎用/暂缓指征。推迟新冠接种，等心血管专科医生详细评估。',
        guidance: '避免短期内接种后续新冠疫苗。需要专科彻底检查排除心肌炎活动病灶后再考虑是否接种。其他非新冠常规疫苗可以照常评估接种。',
        advice: '“如果宝宝以前的心肌炎是在打新冠疫苗后 3 周内发生的，或者宝宝得过新冠病毒引起的全身多系统炎症综合征（MIS-C），后续的新冠疫苗我们需要先暂缓。其他常规疫苗不受此影响。”',
        mechanism: '主要为防范新冠疫苗接种后发生极罕见的心肌损伤/心包炎的累加风险或免疫级联反应。',
      });
    } else {
      decisions.push({
        ruleId: 'q8_myocarditis_misc_unrelated',
        ruleTitle: '无关且完全康复的心肌炎',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '准予按常规接种所有疫苗（包括新冠疫苗）。',
        guidance: '完全康复且与疫苗接种无关联的心肌炎不是禁忌，只要患儿目前处于正常活动状态，可照常完成常规和新冠接种。',
        advice: '“如果是和疫苗打针完全没有关系、而且现在已经完全好了、恢复正常活动的心肌炎，是可以安全接种常规疫苗的，家长不用过于担心。”',
        mechanism: '与疫苗无关且已恢复的普通心肌炎患者并无持续的免疫敏感性。',
      });
    }
  }

  // ==================== Rule 9: q9_immunodeficiency ====================
  if (data.answers.q9_immunodeficiency) {
    const hasImmune = data.details.immuneTypes.length > 0;
    
    if (data.details.immuneTypes.includes('scid')) {
      decisions.push({
        ruleId: 'q9_immunodeficiency_scid',
        ruleTitle: 'SCID / T细胞缺陷 (绝对免疫缺陷)',
        code: 'cocooning',
        title: '绝对禁用减毒活疫苗 & 强烈启动家庭蚕茧接种方案 (Cocooning / Red Light)',
        action: '绝对禁用一切减毒活疫苗（如卡介苗、轮状病毒、麻腮风、水痘等）。 自身死疫苗极可能不产生应答。强制启动家庭“蚕茧接种方案” (Cocooning Strategy)！',
        guidance: '1. 自身禁止接种任何活疫苗。\n2. 强制动员其全部共同居住的家庭成员、看护人员及密切接触者补齐所有常规疫苗。\n3. 隔离约束：若同住婴儿服用口服轮状病毒疫苗，SCID 患儿在接种后 30 天内必须完全避免接触该婴儿粪便或参与更换尿布。',
        advice: '“由于宝宝患有严重的先天性免疫缺陷（SCID），绝对不能接种任何含有活病毒活细菌的‘减毒活疫苗’（如卡介苗、轮状、麻腮风、水痘）。打活针会导致全身严重的致命发病。此时最核心最有效的防护是‘蚕茧计划’：全家和所有亲密看护者必须打满各种常规疫苗和流感新冠死针，在家中形成一道安全的‘防护蚕茧’。”',
        mechanism: 'SCID 患儿缺乏功能性 T 细胞，无法清除减毒活疫苗病毒，会导致致命的播散性疫苗株感染。',
      });
    }

    if (data.details.immuneTypes.includes('rituximab')) {
      const conflict: ConflictTip = {
        title: '抗 CD20 单抗（利妥昔单抗）停药后接种恢复间隔',
        chinaPolicy: '2026年中国国家免疫程序指南：明确要求接受抗 B 细胞抗体（抗 CD20 单抗）治疗者，应推迟到【停用后至少 6 个月】再恢复疫苗接种。',
        westernPolicy: '欧美ACIP / 英国Green Book等指南：多数推荐停用利妥昔单抗后【等待 6 至 12 个月】且必须进行免疫重置评估（复查 CD19+/CD20+ B 细胞计数和定量免疫球蛋白水平恢复正常后），方可开展接种，并往往需要从头全系列重新补种。'
      };

      decisions.push({
        ruleId: 'q9_immunodeficiency_rituximab',
        ruleTitle: '接受抗 CD20 单抗治疗 (利妥昔单抗)',
        code: 'yellow',
        title: '所有疫苗暂缓接种 (Yellow Light / Defer)',
        action: 'All_Vaccines = DEFER。暂缓一切非活疫苗和活疫苗的接种（均无免疫应答且存安全性隐患）。',
        guidance: '在治疗彻底结束满 6 个月且 CD19+ B 细胞计数恢复正常后，必须将患者视为从未接种过的“空白状态”从头启动全系列重新接种。',
        advice: '“因为宝宝使用了清除 B 细胞的利妥昔单抗。这导致他体内目前完全无法制造保护性的抗体，现在不管打什么疫苗都产生不了免疫力。所以今天任何针都不能打，要等到治疗彻底结束后再等 6 个月，等抽血看到 B 细胞数量恢复后，像新生儿一样一针针从头重打补齐所有疫苗。”',
        mechanism: '抗 CD20 单抗靶向清除 B 淋巴细胞，导致体液免疫功能在治疗期间及结束后数月内处于瘫痪状态。',
        conflict
      });
    }

    if (data.details.immuneTypes.includes('steroids')) {
      const w = parseFloat(data.details.steroid.weight) || 0;
      const d = parseFloat(data.details.steroid.dose) || 0;
      const dur = parseFloat(data.details.steroid.duration) || 0;

      if (dur >= 14 && (d >= 20 || (w > 0 && d / w >= 2.0))) {
        const conflict: ConflictTip = {
          title: '大剂量系统性糖皮质激素停药后活疫苗接种安全间隔',
          chinaPolicy: '2026年中国国家免疫程序指南：大剂量全身皮质激素治疗结束后，减毒活疫苗接种只需【停药满 1 个月】即可安全进行。',
          westernPolicy: '欧美ACIP / 爱尔兰NIAC指南：对于接受大剂量激素（强的松等量 ≥2 mg/kg/天或 ≥20 mg/天，持续14天以上）治疗者，接种减毒活疫苗推荐【停药满 3 个月】（90天）方可接种。1个月内仅可接种死/灭活疫苗。'
        };

        decisions.push({
          ruleId: 'q9_immunodeficiency_steroids_high',
          ruleTitle: `大剂量系统性糖皮质激素治疗 (持续 ${dur} 天)`,
          code: 'yellow',
          title: '减毒活疫苗绝对禁忌 (Yellow Light / Live Vaccines Red)',
          action: 'Live_Vaccines = ABSOLUTE_CONTRAINDICATION。在此大剂量免疫抑制应用期间绝对禁用一切减毒活疫苗。',
          guidance: '安全等待期：必须在激素完全停药满 1 个月方可再次评估并接种减毒活疫苗。非活/灭活死疫苗可正常接种，但免疫效果会打折扣。',
          advice: '“因为宝宝正在服用大剂量的糖皮质激素，并且服药已经超过了2个星期。这会短时期内压抑身体的免疫。今天绝对不能给宝宝打任何含有活成分的减毒活疫苗。等疗程结束、完全停药满 1 个月以上，才能把活疫苗补种上。”',
          mechanism: '全身大剂量应用糖皮质激素具有显著的免疫抑制作用。需等待停药后免疫应答功能复原方可注射活疫苗。',
          conflict
        });
      } else {
        decisions.push({
          ruleId: 'q9_immunodeficiency_steroids_low',
          ruleTitle: '低剂量或短疗程糖皮质激素治疗',
          code: 'green',
          title: '准予接种 (Green Light)',
          action: '准予接种。允许在停药后立即正常接种活疫苗。',
          guidance: '短疗程（<14天）或低剂量、局部吸入、外用糖皮质激素治疗不具有明显的全身免疫抑制作用。停药后即可接种活疫苗。',
          advice: '“因为宝宝吃激素的时间少于 14 天，或者剂量很小（或者仅仅是皮肤擦激素药膏、吸入哮喘气雾剂），这不会对全身免疫产生明显的压抑，可以正常打针。”',
          mechanism: '短疗程或生理维持量的糖皮质激素不会导致系统性 T/B 细胞耗竭。',
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
          guidance: '1. 术前抢种：非活/灭活死疫苗手术前至少 2 周完成，减毒活疫苗手术前至少 4 周完成。\n2. 做好移植前最后安全窗口的快速接种，一旦开始术后强抗排异将无法打活疫苗。',
          advice: '“由于宝宝目前正在等待进行器官移植，术后他需要长期服用强效抗排异药，免疫力会很低，将不能打活针。因此我们必须抢在手术和吃药前的‘黄金窗口’把疫苗打完。喷鼻流感活疫苗是绝对不能打的。”',
          mechanism: '移植手术后由于需要强效抗排异治疗，患者机体将长期失去清除活病毒的能力。因此必须在术前安全窗口期完成免疫。',
        });
      } else if (phase === 'early') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_sot_early',
          ruleTitle: '实体器官移植后早期 (0-2 个月) 大剂量抗排异期',
          code: 'red',
          title: '极度免疫抑制绝对禁忌 (Red Light)',
          action: 'All_Vaccines = ABSOLUTE_CONTRAINDICATION。移植后早期大剂量强免疫抑制期，绝对禁止注射任何疫苗。',
          guidance: '1. 处于抗排异大剂量诱导期，完全禁止接种。\n2. 强烈要求共同居住家属采取“蚕茧保护”。',
          advice: '“目前宝宝刚刚做完器官移植手术不满2个月，处于吃大剂量抗排异药的极度免疫抑制时期。这时候是绝对禁忌打任何疫苗的。家人要尽快打全常规疫苗，给宝宝建立保护罩。”',
          mechanism: '移植后前 2 个月是大剂量免疫抑制剂诱导耐受的关键期，体液与细胞免疫被完全阻断，接种任何疫苗均属绝对禁忌并面临极高感染风险。',
        });
      } else if (phase === 'maintenance') {
        decisions.push({
          ruleId: 'q9_immunodeficiency_sot_maintenance',
          ruleTitle: '实体器官移植后维持期 (术后 2-6 个月起)',
          code: 'yellow',
          title: '维持期灭活疫苗恢复 & 活疫苗长期禁忌 (Yellow Light)',
          action: '减毒活疫苗属于长期绝对禁忌！ 术后 2 至 6 个月起，可恢复常规非活/灭活死疫苗的接种。',
          guidance: '1. 乙肝滴度强制保护程序：定期复查 HBsAb。若 HBsAb 滴度 < 10 mIU/mL，必须使用双倍剂量（40 mcg）或高抗原乙肝疫苗重新完成接种。\n2. 活疫苗属于长期绝对禁忌。',
          advice: '“宝宝目前移植手术已经进入平稳维持阶段（2-6个月以上），死疫苗可以逐步恢复，但是活针绝不能打。同时，因为药会影响抗体产生，我们需要定期抽血复查乙肝抗体，一旦抗体低于10，必须用正常孩子加倍的剂量来重新接种。”',
          mechanism: '维持期抗排异药降至平稳维持剂量，允许恢复常规灭活死疫苗。但因患者处于长期免疫低反应状态，乙肝等必须进行高剂量注射以确保产生抗体。',
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
          guidance: '供体接种必须严格控制时间，旨在规避活病毒减毒株通过移植的造血干细胞水平转染给受体的灾难性风险。',
          advice: '“作为造血干细胞的供体，您接种疫苗需要严格控制时间：必须在采集细胞前 10-14 天打完需要的死疫苗，采集前至少 4 星期完成活疫苗。这是为了绝对防范疫苗里的活病毒留在血液里传给受体患儿。”',
          mechanism: '供体体内接种减毒活疫苗后可能存在短暂病毒血症。若采集时间过近，活病毒可能伴随造血干细胞输入受体体内，在清髓后的受体体内疯狂复制。',
        });
      } else if (hsctPhase === 'rebuilding') {
        const months = parseFloat(data.details.hsct.rebuildMonths) || 0;
        
        if (months < 3) {
          decisions.push({
            ruleId: 'q9_immunodeficiency_hsct_early',
            ruleTitle: `HSCT 清髓清空后早期 (术后 ${months} 个月)`,
            code: 'yellow',
            title: '清髓后早期极度受损期暂缓 (Yellow Light)',
            action: 'All_Vaccines = DEFER。移植后早期不满足任何接种重建条件，全部疫苗挂起暂缓。',
            guidance: '原有的主动免疫记忆彻底丧失，严禁在移植后 3 个月内开始任何常规疫苗重建。推荐全家强制启动“蚕茧接种方案”。',
            advice: '“宝宝刚刚完成造血干细胞移植不久，他的免疫功能目前等同于零，并且以前打过的所有疫苗记忆都被清空了。现在不能打任何针。家人一定要把自己的疫苗打全来给宝宝提供隔离保护，等移植满 3-6 个月后，才能启动死疫苗重建。”',
            mechanism: 'HSCT 预处理会彻底摧毁患者骨髓和原有的免疫记忆。患者处于全无免疫的“空白状态”，需在造血重建、细胞系成成活后方可从头接种。',
          });
        } else {
          const conditions = data.details.hsct.clinicalConditions;
          const liveAllowed = months >= 24 && conditions.immunosuppressantsStopped3m && conditions.noActiveGVHD && conditions.bCellRecoveredIvigStopped3m;
          
          decisions.push({
            ruleId: 'q9_immunodeficiency_hsct_rebuilding',
            ruleTitle: `HSCT 术后主动免疫重建阶段 (第 ${months} 个月)`,
            code: 'yellow',
            title: '全系列主动免疫重建中 & 空白状态重打 (Yellow Light)',
            action: '原有主动免疫记忆彻底丧失，必须将患者视为从未接种过的“空白状态”从头启动全系列重新接种 (Revaccination)！',
            guidance: `【主动重建时间表执行中】：\n` +
                      `1. 肺炎链球菌重建：自移植后 3-6个月起开始，连续接种 3 剂 PCV20 或 PCV15 (每剂间隔 4 周)。\n` +
                      `2. 肺炎多糖与 GVHD 评估：若无慢性GVHD，在移植后 12 个月可接种 1 剂 PPSV23。当前评估为：` +
                      (data.details.hsct.hasGVHD === 'chronic' 
                        ? '【慢性GVHD】：绝对禁用多糖疫苗 PPSV23，必须使用第四剂结合疫苗 PCV (PCV20/PCV15) 替代接种！\n' 
                        : '【无GVHD】：可以在移植满 12 个月后接种 1 剂 PPSV23（与前剂PCV间隔至少8周）。\n') +
                      `3. 减毒活疫苗 (MMR、VAR) 指征：移植必须满 24 个月。当前评估为：` +
                      (liveAllowed 
                        ? '【符合条件，允许接种】：移植满24个月，且已停用激素/抗GVHD >=3个月，无活动性GVHD，且B细胞恢复、停IVIG >=3个月。可以安全接种 MMR 和 VAR。' 
                        : '【暂不符合，绝对禁忌】：尚不完全满足24个月或停药3个月、无活动排异等3项临床硬性条件。活疫苗必须无限期延迟，严禁接种！'),
            advice: `“由于宝宝做了造血干细胞移植，他以前打过的所有疫苗都失效了。我们必须从现在起把他当作从未打过针的孩子，一针针从头重打。目前非常适合补打肺炎结合疫苗、流感死疫苗、新冠死疫苗... 但如果是麻腮风、水痘这些活针，必须在术后满24个月，且确认停药、停丙球满3个月，且没有排异反应才能打。”`,
            mechanism: 'HSCT 清髓摧毁了体液及细胞免疫记忆，导致原发抗体库彻底丧失。多糖疫苗在 GVHD 状态下不具备 T 细胞辅助应答，易导致抗体低应答，应以结合疫苗替代。',
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
        guidance: '凡具有临床免疫异常、原发性免疫缺陷、使用免疫抑制剂等，严禁接种减毒活疫苗。对于死/灭活疫苗可正常接种。',
        advice: '“由于宝宝免疫系统受损，绝对不能接种含有活病毒活细菌的‘减毒活疫苗’。因为他的身体无法像正常孩子一样清除和限制弱病毒的复制。普通的死疫苗可以正常打。全家人要把自己的疫苗打全，形成保护圈。”',
        mechanism: '免疫受损机体存在 T/B 淋巴细胞功能缺陷，无法有效限制活病毒减毒株的复制。',
      });
    }
  }

  // ==================== Rule 10: q10_immonosuppressants_chemo ====================
  if (data.answers.q10_immunosuppressants_chemo && !data.details.immuneTypes.includes('steroids') && !data.details.immuneTypes.includes('rituximab')) {
    const conflict: ConflictTip = {
      title: '肿瘤放化疗/强效免疫抑制剂治疗停药后活疫苗接种安全间隔',
      chinaPolicy: '2026年中国国家免疫程序指南：风湿免疫疾病等接受强效免疫抑制剂、肿瘤放化疗患儿，可在【停用免疫抑制剂治疗后 1 至 6 个月】逐步恢复减毒活疫苗及常规疫苗接种，需综合免疫缺陷病类型和功能检查决定。',
      westernPolicy: '欧美ACIP / 英国Green Book等指南：全身性放疗或传统细胞毒性化疗结束后，推荐【至少等待 3 个月】方可接种减毒活疫苗；若使用高度选择性生物制剂（如抗 B 细胞单抗以外的特定免疫靶向药），则通常需等待停药后【至少 6 个月】。'
    };

    decisions.push({
      ruleId: 'q10_immunosuppressants_chemo',
      ruleTitle: '免疫抑制剂/放化疗治疗史',
      code: 'yellow',
      title: '暂缓接种减毒活疫苗 (Yellow Light / Chemo)',
      action: '放化疗、使用强效免疫抑制剂期间绝对禁用减毒活疫苗。死/灭活疫苗可以接种，但产生的中和抗体可能低下。',
      guidance: '1. 大剂量激素疗程：必须在疗程结束停药满 1 个月后方可补打活疫苗。\n2. 肿瘤放化疗患儿：必须等全部放化疗彻底结束满 3 个月以上，由专科医生评估免疫功能正常后，方可启动活疫苗补种。',
      advice: '“放化疗或服用大剂量免疫抑制药物会极大地压制孩子的免疫系统。在治疗期间，绝对不能打含有活病毒的减毒活疫苗。如果是大剂量吃激素，停药满 1 个月后可以补打活疫苗；如果是肿瘤化疗，通常建议化疗彻底结束满 3 个月以上，由专科医生评估后才能重新补种活疫苗。”',
      mechanism: '化疗和免疫抑制剂药物能够强烈杀伤免疫活性细胞，接种活疫苗具有严重播散复制风险。',
      conflict
    });
  }

  // ==================== Rule 11: q11_family_immunodeficiency ====================
  if (data.answers.q11_family_immunodeficiency) {
    decisions.push({
      ruleId: 'q11_family_immunodeficiency',
      ruleTitle: '先天性免疫缺陷家族史',
      code: 'yellow',
      title: '暂缓接种卡介苗/轮状/麻腮风/水痘等活疫苗 (Yellow Light)',
      action: '标记为卡介苗 (BCG)、轮状病毒疫苗、麻腮风 (MMR)、水痘疫苗的暂缓接种/慎用。推迟接种，直至临床证实该婴儿自身的免疫功能完全正常。',
      guidance: '必须由临床医生开具血液免疫学检查（如 TREC 筛查或基因检测）。一旦证实自身无免疫缺陷，可安全、正常地按期完成常规接种。',
      advice: '“如果宝宝的爸爸、妈妈或者亲兄弟姐姐有先天性的免疫缺陷，在宝宝出生早期，我们不能急着给孩子打卡介苗、轮状、麻腮风和水痘疫苗。我们建议必须先给宝宝做详细的血液免疫学检查（如 TREC 筛查或基因检测），等医生确诊宝宝自身的免疫系统完全健康后，才能开始打这些活疫苗。”',
      mechanism: '部分严重联合免疫缺陷等疾病具有常染色体隐性或 X-染色体连锁遗传模式。在新生儿早期盲目接种活疫苗会导致严重的疫苗株致命扩散。必须先行筛查排除。',
    });
  }

  // ==================== Rule 12: q12_blood_products_antivirals ====================
  if (data.answers.q12_blood_products_antivirals && data.details.bloodType) {
    const calc = calculateDelayDate(data.details.bloodType, data.details.bloodDate);
    const months = ANTIBODY_DATA[data.details.bloodType]?.wait || 0;
    
    if (months > 0) {
      const conflict: ConflictTip = {
        title: '输注血液制品/免疫球蛋白（IVIG）后的注射类活疫苗接种安全间隔',
        chinaPolicy: '2026年中国国家免疫程序说明：统一规定在输注含免疫球蛋白的血液制品后，接种除卡介苗以外的注射类减毒活疫苗（如麻腮风、水痘）需【间隔至少 3 个月】即可。非减毒活疫苗和口服减毒活疫苗无时间间隔限制。',
        westernPolicy: '欧美ACIP/CDC指南：根据血液制品的种类、成分及输注剂量（IgG含量），设置【3至11个月】不等的精细抗体洗脱期。例如：接受川崎病大剂量静脉丙球（IVIG 2g/kg）后需要间隔 11 个月；接受血浆或血小板制品需要间隔 7 个月；接受全血或浓缩红细胞需要间隔 6 个月。'
      };

      decisions.push({
        ruleId: 'q12_blood_products_antivirals',
        ruleTitle: `血液制品/抗体暴露史 (${ANTIBODY_DATA[data.details.bloodType]?.name})`,
        code: 'yellow',
        title: '暂缓接种注射型减毒活疫苗 (Yellow Light / Washout Period)',
        action: '标记为注射型活疫苗（MMR、VAR、MMRV）的暂缓接种。推迟至安全洗脱期满后再进行接种。口服轮状病毒疫苗 (RV) 不受系统循环 IgG 干扰，可随时接种。',
        guidance: `安全洗脱期：输注 ${ANTIBODY_DATA[data.details.bloodType]?.name} 后，必须强制等待至少 ${months} 个月（洗脱期）方可接种 MMR/VAR。\n` +
                  (calc ? `- 推荐补种起始日期：${calc.date} (中国新规要求间隔 ${months} 个月，此数值根据2026中国标准计算)。\n` : '') +
                  (data.details.bloodPostVaccine14d ? `【警示】：由于您在接种 MMR/VAR 活疫苗后的 14 天内被迫输注了血液制品，先前的接种已被判定为【无效接种】，必须在安全洗脱期满后完全重新补种该剂次。` : ''),
        advice: `“由于宝宝近期输过含抗体的血液制品（如 ${ANTIBODY_DATA[data.details.bloodType]?.name}），这些抗体会把我们打进去的麻腮风、水痘疫苗里的弱病毒中和掉，导致产生不了长效抗体。因此，我们必须等待至少 ${months} 个月的抗体洗脱期，等外源抗体消退了，再来补打活疫苗。` +
                (calc ? `推荐在 ${calc.date} 以后补种。` : '') +
                (data.details.bloodPostVaccine14d ? ` 因为您是在接种后14天内输过血的，说明上一次的接种失效了，等洗脱期满后必须重新重打。` : '') +
                `不过普通的死疫苗以及口服的轮状活疫苗不受影响，今天可以正常接种。”`,
        mechanism: '外源性被动 IgG 抗体特异性中和注射的减毒活疫苗病毒，阻断其自主复制与抗原呈递，导致主动免疫建立失败。口服轮状在消化道局部增殖，不受循环中 IgG 影响。',
        conflict
      });
    } else {
      decisions.push({
        ruleId: 'q12_blood_products_washed_rbc',
        ruleTitle: '血液制品/抗体暴露史 (洗涤红细胞)',
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '无需任何等待期。准予常规和减毒活疫苗接种。',
        guidance: '洗涤红细胞（Washed RBCs）中不含有或极微量含有免疫球蛋白，不构成对 MMR、VAR 活疫苗接种的免疫中和干扰。直接正常接种。',
        advice: '“宝宝输注的是洗涤红细胞，里面不含有免疫球蛋白（抗体），因此不会干扰疫苗的效果。今天可以直接、正常接种麻腮风、水痘以及其他任何疫苗，不需要等待任何月数。”',
        mechanism: '洗涤红细胞经过生理盐水反复洗涤，几乎完全去除了血浆中的被动免疫球蛋白成分（IgG），因此没有中和干扰疫苗株的效应，洗脱期为 0 个月。',
      });
    }
  }

  // ==================== Rule 13: q13_pregnancy ====================
  if (data.answers.q13_pregnancy) {
    decisions.push({
      ruleId: 'q13_pregnancy',
      ruleTitle: '妊娠状态',
      code: 'red',
      title: '减毒活疫苗 & HPV 绝对禁忌 (Red Light)',
      action: '绝对禁用一切减毒活疫苗（如 MMR、VAR、LAIV 等）和 HPV 疫苗。',
      guidance: '1. 记录绝对禁忌证档案。2. 灭活流感死疫苗 (IIV) 、百白破（Tdap）和新冠疫苗在孕期任何阶段接种均属于常规推荐（且对胎儿具有极佳被动抗体保护），应当积极推荐接种。3. 若接种了减毒活疫苗，应当避孕 1 个月，但若不慎在孕期接种，绝不作为终止妊娠的指征。',
      advice: '“由于孩子目前正处于妊娠期（怀孕），绝对不能接种麻腮风、水痘或鼻喷流感等减毒活疫苗，也不能接种 HPV 疫苗（如果已经打了首剂，需要等分娩完哺乳期再补齐后续针）。但是，怀孕期间非常推荐打注射型的流感死针和百白破（Tdap），它们能有效通过胎盘把抗体送给宝宝，帮新生儿期避开致命的百日咳和流感。”',
      mechanism: '主要是防范减毒活疫苗株通过胎盘屏障进入胎儿体内导致潜在的病毒垂直传播和先天性畸形。而灭活疫苗不含活病毒，在孕期接种对母婴均高度安全，且能提供早期被动胎盘保护。',
    });
  }

  // ==================== Rule 14: q14_recent_vaccines_4w ====================
  if (data.answers.q14_recent_vaccines_4w) {
    decisions.push({
      ruleId: 'q14_recent_vaccines_4w',
      ruleTitle: '近期 4 周减毒活疫苗接种史',
      code: 'yellow',
      title: '暂缓接种注射型活疫苗 (Yellow Light / Live Interval)',
      action: '若两种注射型减毒活疫苗（或 LAIV）非同天接种，必须强制间隔至少 28 天 (4 周)。',
      guidance: '暂停注射型活疫苗。若上次接种注射型活疫苗（或 LAIV）至今不足 28 天，今日必须推迟接种另一种注射型活疫苗。非活/灭活疫苗之间、非活与活疫苗之间接种无任何限制。',
      advice: '“如果宝宝在过去 4 周内打过需要注射的‘减毒活疫苗’（比如上周刚打了水痘疫苗），由于第一种活疫苗在体内引起的免疫干扰会削弱第二种疫苗的效果，我们今天必须暂缓。但如果上次打的是死疫苗（如百白破、乙肝、流感针、肺炎结合疫苗），或者今天想接种死疫苗，则完全没有限制。”',
      mechanism: '非同天接种的第一种活疫苗阻断诱导产生的干扰素等非特异性抗病毒应答，会在接种后数天至数周内瞬时抑制第二种活病毒在体内的自主复制，造成第二种疫苗免疫建立失败。',
    });
  }

  // ==================== Rule 15: q15_syncope_history ====================
  if (data.answers.q15_syncope_history) {
    decisions.push({
      ruleId: 'q15_syncope_history',
      ruleTitle: '晕针/迷走神经反射史',
      code: 'green',
      title: '常规物理监护指征 (Green Light / Precaution)',
      action: '不属于接种禁忌。准予常规接种，但必须采取临床防晕针物理常规监护措施。',
      guidance: '1. 必须要求患儿采取坐位或仰卧位进行接种，避免空腹接种。\n2. 接种后必须在诊室或接种点强制平卧或静坐留观至少 15 分钟（加强留观）。\n3. 医护人员应做好体位防护，防范摔倒受伤。',
      advice: '“有些孩子在打针时由于紧张，容易心慌、头晕，这属于正常迷走神经反射。请您和孩子放心，我们今天会让孩子坐着或者平躺着接种，避免空腹，并且在打完针后在诊室里静坐观察 15 分钟，完全可以避免危险。接种前多跟孩子聊聊天分散注意力。”',
      mechanism: '晕针是由情绪紧张、焦虑或疼痛刺激激发自主神经失调，导致心率和血压瞬间降低、脑供血不足。不涉及疫苗组分免疫反应，属于物理安全防护。',
    });
  }

  // ==================== Rule 16: q16_anxiety ====================
  if (data.answers.q16_anxiety) {
    decisions.push({
      ruleId: 'q16_anxiety',
      ruleTitle: '接种焦虑',
      code: 'green',
      title: '舒缓接种护理指征 (Green Light / Precaution)',
      action: '不属于禁忌证。准予正常接种。启动无痛/非药物舒缓接种护理指征。',
      guidance: '1. 指导家长在接种时温和抱紧、安抚孩子。\n2. 推荐接种时配合注意力分散技巧以舒缓压力、减轻疼痛感知。',
      advice: '“害怕打针、抗拒针头是孩子们非常普遍且正常的表现。我们会通过温和的引导、分心方法（比如让宝宝吹哨子、故意咳嗽、轻敲皮肤）来帮宝宝度过。请家长在接种时温柔抱紧孩子，我们一起配合，让宝宝在一个轻松、有安全感的环境里完成接种。”',
      mechanism: '接种焦虑是由急性恐惧与针头恐惧引起的。通过非药物心理抚慰与触觉分心方法，可显著抑制脑皮质痛觉敏感度。',
    });
  }


  // ==================== Rule 17 (China 2026 Appended): 黄疸状态判断 ====================
  if (data.details.jaundiceStatus) {
    const js = data.details.jaundiceStatus;
    if (js === 'physiological' || js === 'breastmilk' || js === 'stable_high_bilirubin') {
      let title = '生理性/母乳性黄疸准予接种';
      if (js === 'stable_high_bilirubin') title = '稳定的高胆红素血症/胆汁淤积症准予接种';
      decisions.push({
        ruleId: 'china_2026_jaundice_stable',
        ruleTitle: `2026中国指南：黄疸筛查结论 (${title})`,
        code: 'green',
        title: '准予接种 (Green Light)',
        action: '无需延迟，准予常规按期接种所有国家免疫规划疫苗（卡介苗、乙肝等）。',
        guidance: '根据2026年中国最新预防接种说明：新生儿生理性黄疸、母乳性黄疸不作为疫苗接种的禁忌证，不需暂缓。病情稳定的高胆红素血症或胆汁淤积症者也可以正常接种疫苗。',
        advice: '“根据我国2026年最新的疫苗管理规定：生理性黄疸、母乳性黄疸都不是打疫苗的禁忌。只要宝宝目前精神吃奶都好，哪怕有黄疸，也可以完全正常地注射卡介苗、乙肝疫苗等。这并不会加重黄疸，更不会降低效果，请家长完全放心。”',
        mechanism: '生理性与母乳性黄疸仅属于发育期的非病理性胆红素游离状态，高胆红素血症和胆汁淤积症在原发病因查明、肝功能及生命体征处于稳定期时，疫苗的抗原加工呈递不涉及胆红素代谢路径，接种无任何临床追加风险。'
      });
    } else if (js === 'unstable') {
      decisions.push({
        ruleId: 'china_2026_jaundice_unstable',
        ruleTitle: '2026中国指南：不稳定性/进行性黄疸',
        code: 'yellow',
        title: '暂缓接种 (Yellow Light)',
        action: '暂停卡介苗 (BCG) 和重组乙肝疫苗 (HepB) 接种。',
        guidance: '不稳定性、病因不明、进行性加重的黄疸或伴有精神食欲变差、白陶土样便的新生儿，需立即暂缓接种，并转诊至新生儿科筛查病理性黄疸、胆道闭锁等原发重症。',
        advice: '“宝宝目前的黄疸正在进行性加重，或者病因尚未明确。我们建议先暂缓接种卡介苗和乙肝疫苗，等带宝宝去新生儿科做个检查，排除病理性黄疸、溶血或胆道闭锁等情况，等病情查明、指标稳定后再来补打，这样最稳妥。”',
        mechanism: '不稳定的进行性黄疸可能是病理性黄疸、重症感染、新生儿溶血或胆道畸形（胆道闭锁）的早期体征，盲目接种疫苗的一过性应答可能会增加肝脏代谢负荷，或因偶合发病干扰对重症原发病的早期确诊。'
      });
    }
  }


  // ==================== Rule 18 (China 2026 Appended): 早产儿与极低体重儿卡介苗与乙肝计算 ====================
  const gestAge = parseFloat(data.details.gestationalAge) || 0;
  const birthWt = parseFloat(data.details.birthWeight) || 0;
  const hasPreemieFlag = data.details.isPseudo.includes(2);

  if (gestAge > 0 || birthWt > 0 || hasPreemieFlag) {
    // 1. 卡介苗胎龄界限判断 (2026中国说明特色)
    if (gestAge > 0) {
      if (gestAge <= 31) {
        decisions.push({
          ruleId: 'china_2026_bcg_preterm_31w',
          ruleTitle: `早产儿卡介苗接种胎龄筛查 (胎龄 ${gestAge} 周 ≤ 31周)`,
          code: 'yellow',
          title: '卡介苗出生时暂缓 / 出院前补种 (Yellow Light)',
          action: '出生时暂缓接种卡介苗 (BCG)。待医学评估稳定后，在出院前进行补种。',
          guidance: '根据2026年中国最新免疫程序说明：胎龄大于 31 孕周且医学评估稳定的早产儿，可在出生时接种 BCG。胎龄小于或等于 31 孕周的早产儿，出生时暂缓接种，医学评估稳定后可在出院前接种。',
          advice: '“因为宝宝属于胎龄小于等于 31 周的早产儿，他的皮肤和淋巴系统还比较娇嫩，我国2026年最新指南规定：这种情况出生当天暂缓接种卡介苗，需要等宝宝在医院里长一长，等出院前身体情况稳定了，再在出院前完成接种，这更符合他的生理成熟度。”',
          mechanism: '小于或等于 31 孕周的早产儿皮肤屏障和局部免疫反应（迟发性超敏反应）极度幼稚，出生时皮内注射卡介苗容易因定位不准导致漏入皮下，增加腋下淋巴结结核及皮下脓肿发生率。待出院前组织发育相对成熟时注射更为安全。'
        });
      } else if (gestAge > 31 && gestAge < 37) {
        decisions.push({
          ruleId: 'china_2026_bcg_preterm_stable',
          ruleTitle: `早产儿卡介苗接种胎龄筛查 (胎龄 ${gestAge} 周 ＞ 31周)`,
          code: 'green',
          title: '卡介苗出生时准予接种 (Green Light)',
          action: '只要医学评估稳定，出生当天准予正常接种卡介苗 (BCG)。',
          guidance: '根据2026年中国最新免疫程序说明：胎龄大于 31 孕周且医学评估稳定的早产儿，出生时可以直接接种卡介苗，不需延迟至出院。',
          advice: '“由于宝宝虽然是早产儿，但胎龄已经大于31周了，只要这两天医生评估生命体征平稳，在出生当天是可以直接打卡介苗的，不需要特地等出院，这样能提早给宝宝建立对抗结核菌的屏障。”',
          mechanism: '胎龄大于 31 孕周的早产儿，其真皮结构和吞噬细胞系统发育已能够耐受 0.1 mL 的卡介苗皮内注射，在临床稳定不需重症监护的情况下，出生接种是安全可行的。'
        });
      }
    }

    // 2. 极低出生体重儿 (< 2000g) 且母亲 HBsAg 阳性或不详的乙肝4剂程序判断 (极具中外对比特色)
    if (birthWt > 0 && birthWt < 2000) {
      const mobHbs = data.details.motherHbsag || '';
      
      if (mobHbs === 'positive' || mobHbs === 'unknown') {
        const conflict: ConflictTip = {
          title: '低体重早产儿（<2000g）且母亲 HBsAg 阳性或不详的首剂与4剂程序',
          chinaPolicy: '2026年中国预防接种说明：体重小于2000g的新生儿，如果是 HBsAg 阳性或不详产妇所生，应在【出生后尽早（12小时内）接种第 1 剂 HepB + 100IU 乙肝免疫球蛋白（HBIG）】，并在婴儿满【1月龄、2月龄、7月龄】时按程序再完成 3 剂次乙肝疫苗接种（即出生时1剂，后续1、2、7月共 4 剂次），停药1-2个月需复查抗体。',
          westernPolicy: '欧美ACIP/CDC指南：对此类体重小于 2000g 患儿，也是出生12小时内接种首剂 HepB 和 HBIG。但该出生首剂【绝对不能计入】常规 3 剂次免疫程序。患儿后续必须在婴儿满【1月龄、2-3月龄、6月龄】时重新接种 3 剂次，总共也是接种 4 剂，但免疫接种时间序列点为：【0、1、2、6 月龄】（中方为 0、1、2、7 月龄，具有1个月的时间点差异）。'
        };

        decisions.push({
          ruleId: 'china_2026_hbv_lowweight_risk',
          ruleTitle: `低出生体重儿乙肝首剂管理 (出生体重 ${birthWt}g < 2000g，母亲HBsAg阳性或不详)`,
          code: 'yellow',
          title: '出生12小时内接种首剂乙肝+HBIG & 执行“0-1-2-7月”4剂方案 (Yellow Light)',
          action: '1. 出生12小时内，强制肌内注射第1剂 HepB，并必须在不同部位注射 100 国际单位乙肝免疫球蛋白 (HBIG)。\n2. 强制执行 2026 中国“0-1-2-7月龄”的4剂接种程序。',
          guidance: `执行 2026版中国程序说明：\n` +
                    `- 第一剂：出生12小时内尽早（HepB + HBIG）；\n` +
                    `- 第二剂：满 1 月龄接种；\n` +
                    `- 第三剂：满 2 月龄接种；\n` +
                    `- 第四剂：满 7 月龄接种。\n` +
                    `在接种最后一剂 HepB 后 1-2 个月，进行 HBsAg 和抗-HBs（抗体）滴度检测。若 HBsAg 阴性且抗体 < 10 mIU/mL，可免费重新按程序再接种 3 剂次乙肝疫苗。`,
          advice: '“由于宝宝出生体重小于2000g，且妈妈的乙肝指标为阳性（或不详），宝宝面临极高的垂直感染风险。根据我国2026年最新程序：孩子必须在出生12小时内打第一针乙肝，并且同时在另一侧腿上打一支乙肝免疫球蛋白来紧急保护。另外，因为低体重宝宝免疫应答差，他不能按照普通孩子打3针，必须强制打4针：分别在出生、1个月、2个月和7个月各打一针。在打完第四针后1-2个月，一定要抽血查抗体，抗体不够还要免费重打。”',
          mechanism: '低出生体重儿（<2000g）免疫系统极不成熟，对出生首剂乙肝疫苗的血清抗体阳转率和应答滴度显著低下。但由于母亲带毒，为规避宫内/产道垂直传播，必须在出生12小时内注射首剂疫苗和 HBIG。为补偿其极低的首次免疫效率，必须采用 4 剂次程序进行强化免疫建立，并在接种后复查抗体以防低应答漏网。',
          conflict
        });
      } else if (mobHbs === 'negative') {
        const conflict: ConflictTip = {
          title: '低体重早产儿（<2000g）且母亲 HBsAg 阴性的乙肝接种时机',
          chinaPolicy: '2026年中国预防接种说明：只要医学评估生命体征平稳，即使体重小于2000g，也推荐在【出生后 24 小时内】尽早接种第1剂乙肝疫苗。',
          westernPolicy: '欧美ACIP/CDC指南：对于母亲为 HBsAg 阴性的体重小于 2000g 早产儿，首剂乙肝疫苗可以【延迟到生后 1 个月，或在出院时接种】，因为出生时接种在体重过低儿中应答极差，延迟至1月龄时接种免疫效果更佳。'
        };

        decisions.push({
          ruleId: 'china_2026_hbv_lowweight_normal',
          ruleTitle: `低出生体重儿乙肝首剂管理 (出生体重 ${birthWt}g < 2000g，母亲HBsAg阴性)`,
          code: 'green',
          title: '出生24小时内准予接种首剂乙肝 (Green Light)',
          action: '只要患儿生命体征平稳，无需等待体重达到 2000g，出生后 24 小时内准予接种第一剂乙肝疫苗。后续按 0-1-6 月正常完成 3 剂。',
          guidance: '根据2026中国版接种程序：HBsAg 阴性母亲所生小于2000g早产儿，只要生命体征平稳，无需延迟，出生24小时内正常接种第1剂乙肝疫苗，后续按常规程序补种。',
          advice: '“因为妈妈的乙肝指标是阴性的，宝宝没有被传染的危险。虽然宝宝是个低体重儿，但只要生命体征平稳，我国最新的指南仍推荐在出生后 24 小时内尽早把第一针乙肝打上，后续按照正常的1个月、6个月再各打一针即可。不用特地等到长到2000g再打。”',
          mechanism: '虽然出生体重小于 2000g 的早产儿首剂应答不理想，但对于 HBsAg 阴性母亲，只要患儿无重度窒息、极低出生体重危重症等生命体征平稳，尽早启动 HepB 接种有助于提高全社会首剂接种率和规避未知社会暴露。',
          conflict
        });
      }
    }
  }


  // ==================== Rule 19 (China 2026 Appended): HIV 感染母亲所生儿童 (精细附表逻辑) ====================
  if (data.details.hivStatus) {
    const hs = data.details.hivStatus;
    
    if (hs === 'infected_symptoms' || hs === 'infected_no_symptoms') {
      decisions.push({
        ruleId: 'china_2026_hiv_infected',
        ruleTitle: `HIV 感染母亲所生确诊感染儿童 (状态: ${hs === 'infected_symptoms' ? '有症状/严重免疫抑制' : '无严重免疫抑制'})`,
        code: hs === 'infected_symptoms' ? 'red' : 'yellow',
        title: hs === 'infected_symptoms' ? '减毒活疫苗(包括MMR)绝对禁忌 (Red Light)' : '减毒活疫苗大部分禁用 & 灭活疫苗准予接种 (Yellow Light)',
        action: `1. 绝对禁止接种：卡介苗 (BCG)、口服脊灰减毒 (bOPV)、乙脑减毒 (JE-L)、甲肝减毒 (HepA-L)。\n` +
                `2. 麻腮风 (MMR) 判定：` + (hs === 'infected_symptoms' ? '【绝对禁止接种】（有严重免疫抑制或相关症状）。\n' : '【准予接种】（仅限无严重免疫抑制的感染者）。\n') +
                `3. 灭活死疫苗（HepB, IPV, DTaP, DT, JE-I, MPSV-A/AC, HepA-I, HPV）均【准予常规接种】。`,
        guidance: `根据2026年中国版“HIV 感染母亲所生儿童接种建议附表”：\n` +
                  `- 确诊感染且有症状或严重免疫抑制：卡介苗(×), 脊灰减毒(×), 乙脑减毒(×), 甲肝减毒(×), 麻腮风(×)。\n` +
                  `- 确诊感染但无严重免疫抑制：卡介苗(×), 脊灰减毒(×), 乙脑减毒(×), 甲肝减毒(×), 麻腮风(√)。\n` +
                  `- 其他灭活疫苗：在确诊感染儿童中均属于无特殊禁忌(√)，应尽早使用 IPV 代替 bOPV 完成脊灰接种，百白破、脑膜炎多糖灭活死疫苗正常按程序开展。`,
        advice: `“由于宝宝已经确诊为 HIV 感染，我们必须高度保护他不受疫苗株活病毒的伤害。我国2026年最新指南附表明确规定：宝宝绝对禁止接种卡介苗、口服糖丸活疫苗、乙脑活疫苗和甲肝活疫苗（这些全都有替代的灭活死针，例如用打针的脊灰死针IPV、甲肝死针和乙脑死针）。对于麻腮风活疫苗，` + 
                (hs === 'infected_symptoms' ? '因为宝宝目前有相关症状或严重免疫抑制，所以是绝对禁止接种的。' : '因为宝宝目前免疫系统还未受到严重破坏、没有症状，为了防止严重的麻疹感染，他是完全可以且应当打这针的。') +
                ` 所有普通的死针（百白破、流脑、乙肝等）均非常安全，应正常打。”`,
        mechanism: '确诊 HIV 感染儿童存在细胞免疫缺陷。减毒活疫苗株进入其体内后可能无法被清除，导致播散性全身疫苗株感染，可致死。故 BCG、bOPV、JE-L、HepA-L 属于绝对禁忌。麻腮风在无严重免疫抑制时，接种收益远大于潜在风险，故无严重免疫抑制确诊者可以接种，有严重免疫抑制者禁用。灭活疫苗不含活抗原，无感染风险。'
      });
    } else if (hs === 'unknown_symptoms' || hs === 'unknown_no_symptoms') {
      decisions.push({
        ruleId: 'china_2026_hiv_unknown',
        ruleTitle: `HIV 感染母亲所生状况不详儿童 (状态: ${hs === 'unknown_symptoms' ? '有症状/严重免疫抑制' : '无严重免疫抑制'})`,
        code: 'yellow',
        title: '卡介苗 & 减毒活疫苗暂缓接种 & 灭活疫苗正常接种 (Yellow Light)',
        action: `1. 暂缓接种：卡介苗 (BCG)。待后续检测确认未感染 HIV 后再行补种。\n` +
                `2. 绝对禁止/暂缓接种：口服脊灰减毒 (bOPV)、乙脑减毒 (JE-L)、甲肝减毒 (HepA-L)。\n` +
                `3. 麻腮风 (MMR) 判定：` + (hs === 'unknown_symptoms' ? '【绝对禁止接种】（有严重免疫抑制/症状）。\n' : '【准予接种】（无严重免疫抑制，不详状态下推荐接种以提供保护）。\n') +
                `4. 灭活死疫苗（HepB, IPV, DTaP, DT, JE-I, MPSV-A/AC, HepA-I, HPV）均【准予常规接种】。`,
        guidance: `根据2026年中国版“HIV 感染母亲所生儿童接种建议附表”：\n` +
                  `- 状况不详且有症状或严重免疫抑制：卡介苗(暂缓), 脊灰减毒(×), 乙脑减毒(×), 甲肝减毒(×), 麻腮风(×)。\n` +
                  `- 状况不详且无严重免疫抑制：卡介苗(暂缓), 脊灰减毒(×), 乙脑减毒(×), 甲肝减毒(×), 麻腮风(√)。\n` +
                  `- 暂缓接种卡介苗：需在出生后进行 HIV 检测，待确认排除感染 HIV 之后，立即予以补种卡介苗。如果确认感染，则永久禁用。`,
        advice: `“因为宝宝是由 HIV 感染的妈妈所生，宝宝目前的感染状况还在排查‘不详’阶段。为了宝宝的安全，我国2026最新规定：卡介苗今天需要先【暂缓接种】，我们要等宝宝的 HIV 排查结果出来，一旦确认宝宝没有被传染，就要马上把卡介苗补种上。同时，口服脊灰糖丸、乙脑活针、甲肝活针在情况不详时也不能打，但可以改打相应的死针（如IPV）。关于麻腮风，` + 
                (hs === 'unknown_symptoms' ? '因为宝宝目前有疑似症状或重度免疫受损，所以先不要接种。' : '因为宝宝目前身体状况稳定，无严重免疫抑制，按规定是可以且应当接种麻腮风活疫苗以提供关键防护的。') +
                ` 所有的死针完全可以正常打。”`,
        mechanism: 'HIV 感染母亲所生的婴儿体内带有母体 IgG 抗体，18月龄内初查抗体阳性不代表真实感染。但在感染状况最终查明（需经 PCR 或 18月龄后抗体转阴）之前，应假设其有潜在缺陷风险。故 BCG 暂缓至排除感染后补齐，bOPV/JE-L/HepA-L 禁用。MMR 在无严重免疫受损时可安全诱导应答，防止流行发病。'
      });
    } else if (hs === 'uninfected') {
      decisions.push({
        ruleId: 'china_2026_hiv_uninfected',
        ruleTitle: 'HIV 感染母亲所生已确证未感染儿童',
        code: 'green',
        title: '准予接种所有疫苗 (Green Light)',
        action: '无任何特殊限制。准予正常接种所有国家免疫规划疫苗（包括卡介苗、bOPV等各种减毒活疫苗）。',
        guidance: '根据2026中国指南：确认未感染 HIV 的儿童，其免疫系统功能完好，可以完全正常、按常规程序接种所有减毒活疫苗和灭活疫苗。若此前有暂缓接种的卡介苗，应立即补种。',
        advice: '“太好了！宝宝的排查结果已经证实没有感染 HIV。这说明宝宝和正常孩子一模一样，他的免疫系统非常健康。今天我们可以完全正常、放心地接种所有的疫苗，包括之前推迟的卡介苗，现在需要立刻给宝宝补齐。”',
        mechanism: '一经病毒核酸（PCR）或 18 月龄后抗体确证排除 HIV 感染，婴儿无任何原发或继发性细胞免疫缺陷风险，接种活疫苗安全且高效。'
      });
    }
  }


  // ==================== Rule F: Preemie & LBW check ====================
  if (data.details.isPseudo.includes(2)) {
    if (data.details.currentLocation === 'nicu' && ageInMonths >= 1.5) {
      decisions.push({
        ruleId: 'q_preemie_nicu',
        ruleTitle: '早产儿/低出生体重儿住院 NICU 期间',
        code: 'red',
        title: 'NICU 期间轮状病毒活疫苗绝对禁忌 (Red Light)',
        action: 'Live_Rotavirus_Vaccine = ABSOLUTE_CONTRAINDICATION。住院期间严禁在病房内口服轮状病毒疫苗。',
        guidance: 'Action: Defer RV vaccination until the day of hospital discharge or later。防止减毒株经粪便排出水平传播给 NICU 病房内其他极度脆弱的新生儿。常规死疫苗若病情稳定必须按实足年龄正常接种。',
        advice: '“因为宝宝目前还在新生儿监护室住院治疗，虽然他的实足年龄已经满足了打轮状病毒疫苗的条件，但由于轮状病毒疫苗是口服减毒活疫苗，接种后病毒会通过粪便排出，容易在密闭脆弱的 NICU 病房里传播感染其他极其危重的宝宝。所以住院期间绝对不能吃这个药，必须等出院回家当天或出院后才能补种。其他普通的死疫苗若宝宝情况稳定，必须按出生后的实足年龄正常打。”',
        mechanism: '早产儿及低体重儿病情稳定后应按实足年龄（Chronological Age）接种。但由于口服轮状减毒活疫苗会在肠道内复制并经由粪便排出，在 NICU 密闭环境中极易发生患者间水平交叉感染，对其他极脆弱早产儿造成致死性胃肠炎风险。故 NICU 住院期禁用。',
      });
    }
  }

  // ==================== Determine overall summary level ====================
  let level: Report['level'] = 'green';
  if (decisions.some(d => d.code === 'cocooning')) {
    level = 'cocooning';
  } else if (decisions.some(d => d.code === 'red')) {
    level = 'red';
  } else if (decisions.some(d => d.code === 'yellow')) {
    level = 'yellow';
  }

  // If no decision added
  if (decisions.length === 0) {
    decisions.push({
      ruleId: 'healthy',
      ruleTitle: '常规健康儿童筛查',
      code: 'green',
      title: '准予接种 (Green Light)',
      action: '无任何绝对禁忌与慎用。按照年龄适宜的常规一类/二类预防接种程序实施。',
      guidance: '接种后必须在接种点平卧或静坐强制留观 15 至 30 分钟，严防防范极罕见的急性过敏反应发生。',
      advice: '“评估结果显示宝宝目前的身体状况一切正常，没有发现任何疫苗接种的禁忌证。建议按计划接种当前月龄应该打的疫苗。打完针后，请务必在留观室安静观察 30 分钟，确保没有任何不舒服再回家哦！”',
      mechanism: '临床前置筛查未发现致敏抗原、免疫受损、干扰因子等风险因素，患儿免疫屏障完好，接种常规和非一类疫苗安全且获益巨大。',
    });
  }

  let overallSummary = '';
  if (level === 'cocooning') {
    overallSummary = `评估结论：【蚕茧免疫 / Cocooning Strategy】。患儿由于存在极重度原发性免疫缺陷（如SCID），自身禁止接种任何减毒活疫苗，且由于免疫应答极其低下，死疫苗接种可能无应答。必须强制全家及共同居住者建立蚕茧式接种，全员打齐流感及新冠灭活等疫苗以切断野生株传播。`;
  } else if (level === 'red') {
    overallSummary = `评估结论：【绝对禁忌 / Red Light】。发现患儿存在特定的疫苗绝对禁忌症（如既往疫苗严重过敏休克、肠套叠史、或妊娠等），必须永久或长期取消接种对应疫苗。需将禁忌记入电子档案，改用其他抗原或物理保护措施，周围人需加强接种形成群落保护。`;
  } else if (level === 'yellow') {
    overallSummary = `评估结论：【暂缓接种 / Yellow Light】。发现患儿目前处于急性期、不稳定性黄疸、小于31周早产卡介苗暂缓，或尚处于大剂量应用激素、放化疗、输注血液制品的安全洗脱等待期中。当前不宜开展特定或全部接种。请在安全期满或病情平稳后，尽快开展补种。`;
  } else {
    overallSummary = `评估结论：【准予接种 / Green Light】。患儿无绝对禁忌与慎用，或仅存在稳定的脑瘫、发育迟缓、控制良好的癫痫、生理/母乳性黄疸等稳定状态。请按计划接种，接种后需严格进行 15-30 分钟常规留观。`;
  }

  return {
    level,
    decisions,
    overallSummary,
  };
};
