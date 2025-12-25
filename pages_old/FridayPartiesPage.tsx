import React from 'react';
import WeekdayPartiesPage from './WeekdayPartiesPage';

const FridayPartiesPage: React.FC = () => (
  <WeekdayPartiesPage
    weekday={5}
    canonicalPath="/friday-parties"
    pageTitle="מסיבות יום שישי | Parties 24/7"
    pageDescription={"מסיבות יום שישי הכי שוות בארץ מחכות לכם כאן. בחרו את הרחבה ואת הוייב והתחילו את הסופ\"ש."}
    heading="מסיבות יום שישי"
    intro={"הגיע יום שישי ואתם מחפשים את המסיבה המושלמת? ריכזנו את כל האירועים הכי טובים לסופ\"ש."}
  />
);

export default FridayPartiesPage;
