import type { Question } from '../types';

// Source: "MYTH or FACT Question.docx".
export const SEED_QUESTIONS: Question[] = [
  {
    id: 'mof-myth-1',
    statement: 'Obesity is only caused by unhealthy eating habits and lack of exercise.',
    answer: 'myth',
    explanation:
      'Obesity is a complex disease influenced by many factors which include genetics, environment, medications, lifestyle and hormones.',
    references: [
      'Greenway FL. Int J Obes (Lond). 2015;39(8):1188-1196.',
      'Romieu I, et al. editors. Lyon (FR): International Agency for Research on Cancer; 2017. (IARC Working Group Reports, No. 10.). Accessed 22 August 2025. Available from: https://www.ncbi.nlm.nih.gov/books/NBK565811/',
      'Albano G, et al. Neurosci Biobehav Rev. 2019;107:846-861.',
      'Bouchard C. Obesity 2021;29(5):802-820.',
      'Albuquerque D, et al. British Medical Bulletin 2017;123:159-173.',
      'NIH. Accessed 22 August 2025. Available from: https://www.nhlbi.nih.gov/health/overweight-and-obesity/causes',
    ],
  },
  {
    id: 'mof-myth-2',
    statement: 'If weight and BMI are in the “normal” range, means you are healthy.',
    answer: 'myth',
    explanation:
      'Weight and BMI do not tell the whole story. You can have normal BMI yet carry dangerously high percentage of body fat and low muscle mass.',
    references: [
      'Nuttall FQ. Body Mass Index. Nutrition Today. 2015 Apr 7;50(3):117–28. Available from: https://pmc.ncbi.nlm.nih.gov/articles/PMC4890841/',
    ],
  },
  {
    id: 'mof-myth-3',
    statement: 'Exercising and eating healthily are the only ways to lose weight.',
    answer: 'myth',
    explanation:
      'Lifestyle modification remains as the foundation of weight management. However, some people may also benefit from medical treatments such as obesity management medication, surgery if needed.',
    references: ['CPG Management of Obesity 2nd Edition 2023.'],
  },
  {
    id: 'mof-myth-4',
    statement: 'Once I lose weight, it will be easy for me to keep it off.',
    answer: 'myth',
    explanation:
      'Keeping weight off might be hard based on how your body responds to weight loss. Your body may be increasing hunger and slowing metabolism, making it harder to maintain your weight.',
    references: [
      'Most J, Redman LM. Exp Gerontol. 2020 May;133:110875.',
      'Lam YY, et al. Mol Metab. 2016;5(11):1057-1071.',
      'Hall KD, et al. Med Clin North Am. 2018;102(1):183-197.',
      // The source document ends this citation mid-way ("In Weight Loss:").
      'Alkhatry M. In Weight Loss.',
    ],
  },
  {
    id: 'mof-fact-1',
    statement: 'Losing just 5% of your body weight can improve your health.',
    answer: 'fact',
    explanation: 'Even a small amount of weight loss can help improve blood pressure and cholesterol levels.',
    references: [
      'Ryan DH, Yockey SR. Weight Loss and Improvement in Comorbidity: Differences at 5%, 10%, 15%, and over. Current Obesity. 2017 Apr 28;6(2):187–94.',
    ],
  },
  {
    id: 'mof-fact-2',
    statement: 'Obesity is linked to more than 200 health complications/diseases.',
    answer: 'fact',
    explanation:
      'Obesity can lead to more than 200 health complications/diseases which include stroke, cancer, heart diseases, Type 2 diabetes and more.',
    references: [
      'Hildebrand S, Pfeifer A. Pflugers Arch. 2025 May;477(5):657-668.',
      'Prospective Studies Collaboration; Whitlock G, et al. Body-mass index and cause-specific mortality in 900 000 adults: collaborative analyses of 57 prospective studies. Lancet. 2009 Mar 28;373(9669):1083-96.',
      'MedSci KKF, et al. Diabetes Obes Metab. 2023 Sep;25(9):2669-2679.',
    ],
  },
  {
    id: 'mof-fact-3',
    statement: 'Body fat around your internal organs can affect your health.',
    answer: 'fact',
    explanation: 'Excess body fat around your internal organs will increase the risk of having diabetes, heart diseases and stroke.',
    references: [
      'Wiley TMP, Poirier P, Burke LE, Després JP, Larsen PG, Lavie CJ, et al. Obesity and cardiovascular disease: A scientific statement from the American Heart Association. Circulation. 2021;143(21):984–1010.',
    ],
  },
  {
    id: 'mof-fact-4',
    statement: 'Two people with same body weight can have different amounts of body fat.',
    answer: 'fact',
    explanation:
      'Body weight alone doesn’t tell the whole story. Body composition analysis can help you better understand your body fat and muscle mass.',
    references: [
      'Bennett JP, Lim S. The critical role of body composition assessment in advancing research and clinical health risk assessment across the lifespan. Journal of Obesity & Metabolic Syndrome. 2025 Apr 8.',
    ],
  },
];
