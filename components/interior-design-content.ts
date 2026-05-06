export type InteriorStyle = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
};

export type InteriorProcessStep = {
  title: string;
  description: string;
};

export const INTERIOR_STYLES_TITLE = "סגנונות עיצוב פנים מובילים (2026)";

export const INTERIOR_STYLES: InteriorStyle[] = [
  {
    slug: "modern-minimalist",
    title: "עיצוב מודרני מינימליסטי",
    subtitle: "קווים נקיים, חללים פתוחים ואור טבעי",
    description:
      "מתאפיין בקווים ישרים ונקיים, חללים פתוחים ומוארים, ושימוש בחומרים כמו זכוכית ומתכת.",
  },
  {
    slug: "rustic-country",
    title: "עיצוב כפרי (Rustic/Country)",
    subtitle: "חומרים טבעיים ואווירה חמימה וביתית",
    description:
      "שימוש נרחב בחומרים טבעיים כמו עץ גולמי ואבן, ליצירת אווירה חמימה, ביתית ומזמינה.",
  },
  {
    slug: "classic",
    title: "עיצוב קלאסי",
    subtitle: "סימטריה, פרטים עשירים ויוקרה על-זמנית",
    description:
      "דגש על סימטריה, פרטים עשירים, עיטורים ופרופורציות מסורתיות שמשדרות יוקרה על-זמנית.",
  },
  {
    slug: "organic-natural",
    title: "עיצוב אורגני וטבעי",
    subtitle: "Biophilic Design עם שלווה והרמוניה",
    description:
      "מגמה חזקה לשנת 2026 המתמקדת בהכנסת הטבע הביתה (Biophilic Design) ליצירת הרמוניה ושלווה. שימוש בצורות מעוגלות, טקסטורות טבעיות וצמחייה.",
  },
  {
    slug: "industrial",
    title: "עיצוב תעשייתי (Industrial)",
    subtitle: "בטון, לבנים חשופות ומתכת מחוספסת",
    description:
      "חשיפת אלמנטים מבניים כמו צינורות, קירות לבנים ובטון חשוף, בשילוב עם רהיטי עור ומתכת.",
  },
  {
    slug: "high-tech-smart-home",
    title: "עיצוב הייטק / בית חכם",
    subtitle: "טכנולוגיה חכמה במראה אלגנטי",
    description:
      "שילוב טכנולוגיה מתקדמת ומערכות חכמות כחלק בלתי נפרד מהאסתטיקה של החלל, תוך שמירה על מראה יוקרתי ולא \"מעבדתי\".",
  },
  {
    slug: "modern-office",
    title: "עיצוב משרדים מודרני",
    subtitle: "חללי עבודה גמישים עם דגש על Well-being",
    description:
      "התמקדות בחללי עבודה גמישים המעודדים יצירתית ושיתוף פעולה, עם דגש על רווחת העובד (Well-being).",
  },
];

export const INTERIOR_PROCESS_TITLE = "תהליך עיצוב פנים";

export const INTERIOR_PROCESS_STEPS: InteriorProcessStep[] = [
  {
    title: "אפיון צרכים ותקציב",
    description:
      "מגדירים מטרות, סגנון חיים, מגבלות חלל ותקציב, כדי לבסס תוכנית עבודה ברורה וישימה.",
  },
  {
    title: "קונספט עיצובי ולוחות השראה",
    description:
      "מגבשים שפה ויזואלית, פלטת צבעים וחומרים מרכזיים באמצעות סקיצות ולוחות השראה.",
  },
  {
    title: "תכנון פונקציונלי וחלוקה לחללים",
    description:
      "מתכננים זרימה נכונה בבית, חלוקת אזורים ותפקוד יומיומי נוח בהתאם לצרכים.",
  },
  {
    title: "בחירת חומרים, צבעים וריהוט",
    description:
      "בוחרים פריטים, גמרים וטקסטורות שיוצרים איזון בין אסתטיקה, עמידות ותחזוקה.",
  },
  {
    title: "תוכניות ביצוע ותיאום ספקים",
    description:
      "מכינים תוכניות מפורטות ומבצעים תיאום מול בעלי מקצוע וספקים עד תחילת העבודה.",
  },
  {
    title: "הלבשה, בקרת איכות ומסירה",
    description:
      "מבצעים סטיילינג סופי, בקרת איכות לכל פרט ומסירת חלל מוכן, שלם והרמוני.",
  },
];
