import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './styles/calendar.module.css'
interface CalendarSliderProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const CalendarSlider: React.FC<CalendarSliderProps> = ({
  initialDate = new Date(),
  onDateSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  
  // Generate dates for the current view
  useEffect(() => {
    const dates: Date[] = [];
    const currentDate = new Date(currentMonth);
    currentDate.setDate(currentDate.getDate() - 3); // Start 3 days before to populate slider
    
    for (let i = 0; i < 10; i++) {
      const date = new Date(currentDate);
      dates.push(date);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setVisibleDates(dates);
  }, [currentMonth]);
  
  // Navigate to previous month
  const goToPreviousMonth = (): void => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  // Navigate to next month
  const goToNextMonth = (): void => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  // Navigate to next week
  const goToNextWeek = (): void => {
    const nextWeek = new Date(visibleDates[visibleDates.length - 1]);
    nextWeek.setDate(nextWeek.getDate() + 1);
    setCurrentMonth(nextWeek);
  };
  const goToPrevWeek = (): void => {
    const prevWeek = new Date(visibleDates[0]);
    prevWeek.setDate(prevWeek.getDate() - 7); // Move 7 days back
    setCurrentMonth(prevWeek);
  };
  
  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };
  
  const isSelectedDate = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };
  
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className={styles.container}>
  {/* Month navigation */}
  <div className={styles["nav-container"]}>
    <button 
      onClick={goToPreviousMonth}
      className={styles["nav-button"]}
      aria-label="Previous month"
    >
      <ChevronLeft size={18} />
    </button>
    <h2 className={styles['month-title']}>{formatMonth(currentMonth)}</h2>
    <button 
      onClick={goToNextMonth}
      className={styles["nav-button"]}
      aria-label="Next month"
    >
      <ChevronRight size={18} />
    </button>
  </div>

  {/* Date slider */}
  <div className={styles["slider-container"]}>
    <div ref={sliderRef} className={styles.slider}>
      {visibleDates.map((date, index) => (
        <div 
          key={index}
          onClick={() => handleDateSelect(date)}
          className={`${styles["date-cell"]} ${
            isSelectedDate(date) ? styles["selected-date"] : ''
          }`}
          aria-selected={isSelectedDate(date)}
          role="gridcell"
        >
          <div className={styles["date-day-number-month"]}>
          <div className={styles["date-day"]}>
            {date.toLocaleDateString('en-US', { weekday: 'short' })}
          </div>
          <div className={styles["number-month"]}>
          <div className={styles["date-number"]}>
            {date.getDate()}
          </div>
          <div className={styles["date-month"]}>
            {date.toLocaleDateString('en-US', { month: 'short' })}
          </div>
          </div>
          </div>
        </div>
      ))}
    </div>

    {/* Right navigation button */}
    <button onClick={goToPrevWeek} className={styles['prev-week-button']}><ChevronLeft size={18}/></button>
    
    <button 
      onClick={goToNextWeek}
      className={styles["next-week-button"]}
      aria-label="Next week"
    >
      <ChevronRight size={18} />
    </button>
  </div>
</div>

  );
};

export default CalendarSlider;