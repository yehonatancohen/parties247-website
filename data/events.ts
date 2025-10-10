import type { EventDetails } from "./models";

export const events: EventDetails[] = [
  {
    slug: "tel-aviv-youth-techno-night",
    name: "מסיבת טכנו לנוער בקלרה",
    description:
      "ערב טכנו בקלאב קלרה שמותאם במיוחד לבני 16–18. הדיג'ייז הביתיים מנגנים סטים מלודים ו-Peak Time עם אפקטים ויזואליים חדשים שהותקנו במיוחד לחופשת פסח. לאורך הערב תמצאו אזור צ'יל בפאטיו, דוכן אוכל מהיר ללא אלכוהול וצוות מדריכים שמוודאים שכל אחד חווה את הלילה בבטחה. אנו ממליצים להגיע מוקדם כדי ליהנות מסדנת ביטים קצרה שמתקיימת לפני פתיחת הרחבה.",
    citySlug: "תל-אביב",
    venue: {
      name: "קלרה",
      address: "הנמל 25, תל אביב",
      mapUrl: "https://maps.google.com/?q=קלרה+תל+אביב",
      phone: "03-555-8822"
    },
    organizer: "Clara Tel Aviv",
    startDate: "2025-04-10T21:30:00+03:00",
    endDate: "2025-04-11T03:30:00+03:00",
    price: 120,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/tel-aviv-youth-techno-night",
    genres: ["טכנו"],
    audiences: ["מסיבות-נוער"],
    times: ["היום", "השבוע", "חמישי"],
    image: "/images/מסיבת-טכנו.svg",
    imageAlt: "נוער רוקד במסיבת טכנו בקלרה תל אביב"
  },
  {
    slug: "tel-aviv-students-edm-festival",
    name: "EDM פסט בלייב פארק",
    description:
      "אגודת הסטודנטים של אוניברסיטת תל אביב מארחת אירוע EDM עצום בלייב פארק ראשון לציון. שלוש רחבות שונות מציעות ביג רום, פרוגרסיב ואזור צ'יל עם הופעות אקוסטיות. הפקה מלאה עם פירוטכניקה, מסכי LED ענקיים, מתחם מזון כשר וחיבור ישיר לשאטלים חזרה לתל אביב, רעננה ונתניה. חוויה מושלמת לפתיחת סמסטר אביב.",
    citySlug: "תל-אביב",
    venue: {
      name: "לייב פארק",
      address: "לייב פארק ראשון לציון",
      mapUrl: "https://maps.google.com/?q=Live+Park+Rishon+LeZion"
    },
    organizer: "אגודת הסטודנטים תל אביב",
    startDate: "2025-04-11T20:00:00+03:00",
    endDate: "2025-04-12T04:30:00+03:00",
    price: 195,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/tel-aviv-students-edm-festival",
    genres: ["EDM"],
    audiences: ["מסיבות-סטודנטים"],
    times: ["השבוע", "שישי", "מחר"],
    image: "/images/פסטיבל-EDM.svg",
    imageAlt: "מסיבת EDM ענקית בלייב פארק"
  },
  {
    slug: "jerusalem-hiphop-old-city",
    name: "היפ הופ על החומות",
    description:
      "ליין רחוב של היפ הופ בירושלים שמתרחש במתחם מגדל דוד עם ראפרים ירושלמים ואמני פריסטייל מהמרכז. הערב כולל סדנת ביטבוקס, תחרות דאנס ואזור ציורי גרפיטי חוקי. האווירה משלבת את הקסם ההיסטורי של העיר העתיקה עם סאונד מודרני ומערכת תאורה המקרינה על החומות. הכניסה מגיל 18 ומעלה.",
    citySlug: "ירושלים",
    venue: {
      name: "מוזיאון מגדל דוד",
      address: "שער יפו, ירושלים",
      mapUrl: "https://maps.google.com/?q=Tower+of+David+Jerusalem"
    },
    organizer: "Tower Beat Crew",
    startDate: "2025-04-12T21:00:00+03:00",
    endDate: "2025-04-13T02:00:00+03:00",
    price: 150,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/jerusalem-hiphop-old-city",
    genres: ["היפ-הופ", "טראפ"],
    audiences: ["מסיבות-סטודנטים", "מסיבות-חיילים"],
    times: ["השבוע", "מוצ״ש"],
    image: "/images/היפ-הופ-ירושלים.svg",
    imageAlt: "מסיבת היפ הופ מול חומות העיר העתיקה"
  },
  {
    slug: "haifa-techno-port-night",
    name: "Port Techno חיפה",
    description:
      "מסיבה אינטימית בנמל חיפה עם סאונדסיסטם חזק ורחבה המשקיפה אל המים. ההפקה מביאה שני די.ג'ייז בינלאומיים וחימום של טאלנטים מקומיים מהעיר התחתית. רחבת ריקוד מרכזית עם ויזואליים בהשראת מנופים ומכולות, מתחם אוכל צמחוני ועמדת מרצ'נדייז של הלייבל המקומי.",
    citySlug: "חיפה",
    venue: {
      name: "Port Club",
      address: "רציף הנמל 4, חיפה",
      mapUrl: "https://maps.google.com/?q=Port+Club+Haifa"
    },
    organizer: "Haifa Underground",
    startDate: "2025-04-10T23:00:00+03:00",
    endDate: "2025-04-11T06:00:00+03:00",
    price: 130,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/haifa-techno-port-night",
    genres: ["טכנו"],
    audiences: ["מסיבות-סטודנטים", "מסיבות-להטב"],
    times: ["השבוע", "חמישי"],
    image: "/images/חיפה-טכנו.svg",
    imageAlt: "רחבת טכנו בנמל חיפה"
  },
  {
    slug: "eilat-holiday-pool-party",
    name: "מסיבת בריכה בסוכות - אילת",
    description:
      "מלון הים האדום באילת מקיים מסיבת בריכה צבעונית לאורך כל חול המועד סוכות. האירוע כולל עמדת DJ עם טראנס קליל בצהריים, ליין פופ בערב ואטרקציות מים זוהרות. במקום פינות ישיבה מוצלות, סוכה כשרה ומסלולי שתייה ללא אלכוהול לנוער. מושלם לחופשה משפחתית שרוצה לשלב בילוי לילה מפוקח.",
    citySlug: "אילת",
    venue: {
      name: "מלון הים האדום",
      address: "חוף הצפוני 3, אילת",
      mapUrl: "https://maps.google.com/?q=מלון+הים+האדום+אילת"
    },
    organizer: "Red Sea Events",
    startDate: "2025-10-15T14:00:00+03:00",
    endDate: "2025-10-15T23:00:00+03:00",
    price: 160,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/eilat-holiday-pool-party",
    genres: ["פופ", "EDM"],
    audiences: ["מסיבות-נוער", "מסיבות-משפחות"],
    times: ["חגים/סוכות"],
    image: "/images/אילת-בריכה.svg",
    imageAlt: "מסיבת בריכה באילת עם קישוטי חג"
  },
  {
    slug: "beer-sheva-students-thursday",
    name: "חמישי בפורום באר שבע",
    description:
      "ליין חמישי הקבוע של מועדון הפורום בבאר שבע מאחד סטודנטים מהאוניברסיטה ומכללת סאפיר לערב של דאנס ופופ-האוס. האירוע פותח ב-Happy Hour, ממשיך להופעת לייב קצרה של להקה דרומית ומסתיים בסט אלקטרוני אנרגטי עד לפנות בוקר. המועדון מציע שאטלים מבאר שבע צפון ומתחנת הרכבת האוניברסיטה.",
    citySlug: "באר-שבע",
    venue: {
      name: "הפורום",
      address: "דרך חברון 28, באר שבע",
      mapUrl: "https://maps.google.com/?q=הפורום+באר+שבע"
    },
    organizer: "Forum Productions",
    startDate: "2025-04-10T22:00:00+03:00",
    endDate: "2025-04-11T05:00:00+03:00",
    price: 90,
    currency: "ILS",
    ticketUrl: "https://tickets.parties247.co.il/events/beer-sheva-students-thursday",
    genres: ["האוס", "פופ"],
    audiences: ["מסיבות-סטודנטים", "מסיבות-חיילים"],
    times: ["השבוע", "חמישי"],
    image: "/images/באר-שבע-סטודנטים.svg",
    imageAlt: "סטודנטים רוקדים במועדון הפורום"
  }
];

export const eventSlugs = events.map((event) => event.slug);
