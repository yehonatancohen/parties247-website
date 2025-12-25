import React from 'react';
import WeekdayPartiesPage from './WeekdayPartiesPage';

const SaturdayPartiesPage: React.FC = () => (
  <WeekdayPartiesPage
    weekday={6}
    canonicalPath="/saturday-parties"
    pageTitle="מסיבות יום שבת | Parties 24/7"
    pageDescription={"לא מוכנים לסגור את הסופ\"ש? מצאו כאן את כל מסיבות יום שבת שממשיכות את האנרגיה עד הרגע האחרון."}
    heading="מסיבות יום שבת"
    intro="המסיבות של יום שבת שומרות על הוייב חי עד תחילת השבוע. בחרו את המסיבה שהכי מתאימה לכם."
  />
);

export default SaturdayPartiesPage;
