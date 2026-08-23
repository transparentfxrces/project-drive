import { useState, useEffect, useMemo } from "react";

import "./styles/Variables.css";
import "./styles/Global.css";
import "./styles/Shared.css";
import "./styles/Navigation.css";
import "./styles/Dashboard.css";
import "./styles/Workout.css";
import "./styles/FootballProgram.css";
import "./styles/History.css";
import "./styles/Performance.css";
import "./styles/Profile.css";
import "./styles/RecruitProfile.css";
import "./styles/Achievements.css";
import "./styles/Animations.css";
import "./styles/Progress.css"
import "./styles/Coaching.css"
import "./styles/PRCelebration.css"
import "./styles/Calendar.css"

import Header from "./components/Header";
import Navigation from "./components/Navigation";
import PRCelebration from "./components/PRCelebration";

import Dashboard from "./pages/Dashboard";
import WorkoutPage from "./pages/WorkoutPage";
import ProgressPage from "./pages/ProgressPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import RecruitProfilePage from "./pages/RecruitProfilePage";
import PerformancePage from "./pages/PerformancePage";
import WorkoutSummaryPage from "./pages/WorkoutSummaryPage";
import CoachingPage from "./pages/CoachingPage";
import CalendarPage from "./pages/CalendarPage";
import AuthPage from "./pages/AuthPage";

import { supabase } from "./services/supabase";
import { signOut } from "./services/auth";

import exerciseLibrary from "./data/exerciseLibrary";
import footballProgram from "./data/footballProgram";

import checkAchievements from "./utils/checkAchievements";
import checkQuests from "./utils/checkQuests";
import syncPerformanceFromWorkout from "./utils/syncPerformance";

import {
  generateDailyQuests,
  generateWeeklyQuests,
} from "./utils/generateQuests";

import usePlayer from "./hooks/usePlayer";
import useXP from "./hooks/useXP";
import usePerformance from "./hooks/usePerformance";
import useWorkout from "./hooks/useWorkout";
import useFavorites from "./hooks/useFavorites";
import useProgression from "./hooks/useProgression";
import useDashboardStats from "./hooks/useDashboardStats";
import useRecovery from "./hooks/useRecovery";


function getWeekKey(){

  const date = new Date();

  const day = date.getDay();

  const diff =
    day === 0
      ? -6
      : 1 - day;

  date.setDate(
    date.getDate() + diff
  );

  date.setHours(
    0,
    0,
    0,
    0
  );

  return date.toDateString();

}

function getDailyResetTime() {
  const now = new Date();

  const tomorrow = new Date(now);

  tomorrow.setDate(now.getDate() + 1);

  tomorrow.setHours(0,0,0,0);

  return tomorrow;
}

function getWeeklyResetTime() {

  const now = new Date();

  const monday = new Date(now);

  const day = monday.getDay();

  const daysUntilMonday =
    day === 0 ? 1 : 8 - day;

  monday.setDate(
    monday.getDate() + daysUntilMonday
  );

  monday.setHours(0,0,0,0);

  return monday;

}

function formatCountdown(target) {

  const diff = target - new Date();

  const totalSeconds = Math.max(
    0,
    Math.floor(diff / 1000)
  );

  const days =
    Math.floor(totalSeconds / 86400);

  const hours =
    Math.floor((totalSeconds % 86400) / 3600);

  const minutes =
    Math.floor((totalSeconds % 3600) / 60);

  if (days > 0)
    return `${days}d ${hours}h`;

  return `${hours}h ${minutes}m`;

}

function App(){


const [page,setPage] =
useState("dashboard");

const [user, setUser] =
  useState(null);

const [authLoading, setAuthLoading] =
  useState(true);

const [timeNow, setTimeNow] = useState(Date.now());

useEffect(() => {
  async function checkSession() {
    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    setUser(
      session?.user ?? null
    );

    setAuthLoading(false);
  }

  checkSession();

  const {
    data: { subscription },
  } =
    supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(
          session?.user ?? null
        );

        setAuthLoading(false);
      }
    );

  return () => {
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {

  const interval = setInterval(() => {
    setTimeNow(Date.now());
  }, 60000);

  return () => clearInterval(interval);

}, []);

// =====================
// Hooks
// =====================

const {
  player,
  updatePlayer,
  updateSeasonGoal,
} = usePlayer();

const {
  xp,
  awardXP,
  levelData,
  lastXPEvent,
  levelUpData,
  dismissLevelUp,
  dismissXPEvent,
} = useXP();

const {
  recovery,
  updateRecovery,

  recoveryHistory,
  saveRecoveryCheckIn,

  recoveryScore,
  readiness,
} = useRecovery();

const [newPR, setNewPR] =
  useState(null);

const [recruitProfile, setRecruitProfile] = useState(() => {
  const saved = localStorage.getItem(
    "recruitProfile"
  );

  return saved
    ? JSON.parse(saved)
    : {
        graduationYear: "",

        height: "",

        weight: "",

        gpa: "",

        sat: "",

        act: "",

        ncaaId: "",

        email: "",

        phone: "",

        hudl: "",

        highlightLink: "",

        bio: "",
      };
});

useEffect(() => {
  if (!lastXPEvent) return;

  const timer = window.setTimeout(() => {
    dismissXPEvent();
  }, 2500);

  return () => {
    window.clearTimeout(timer);
  };
}, [
  lastXPEvent,
  dismissXPEvent,
]);

useEffect(() => {
  if (!levelUpData) return;

  const timer = window.setTimeout(() => {
    dismissLevelUp();
  }, 4500);

  return () => {
    window.clearTimeout(timer);
  };
}, [
  levelUpData,
  dismissLevelUp,
]);

useEffect(() => {
  localStorage.setItem(
    "recruitProfile",
    JSON.stringify(recruitProfile)
  );
}, [recruitProfile]);

const displayXP = Math.max(
  0,
  levelData.currentXP
);

const level = levelData.level;

const {
  metrics,
  goals,
  performanceHistory,
  setMetrics,
  setPerformanceHistory,
  setMetric,
  setGoal,
  saveMetricResult,
} = usePerformance();

function updateMetric(field, value) {
  const updatedMetrics = {
    ...metrics,
    [field]: value,
  };

  setMetric(field, value);

  checkQuests({
    quests,
    setQuests,
    workoutHistory,
    metrics: updatedMetrics,
    changedMetric: field,
    currentWorkout: null,
    favoriteExercises,
    awardXP,
  });
}

function updateGoal(field, value) {
  setGoal(field, value);
}

const {
  currentWorkout,
  setCurrentWorkout,

  workoutHistory,
  setWorkoutHistory,

  workoutSummary,
  setWorkoutSummary,

  exercise,
  setExercise,

  selectedCategory,
  setSelectedCategory,

  searchTerm,
  setSearchTerm,

  selectedWeek,
  setSelectedWeek,

  selectedDay,
  setSelectedDay,

  updateSet,
  updateExerciseName,
  addSet,
  removeExercise,
  addExercise,
  clearWorkout,
  updateWorkout,
  loadCategory,
  addTemplateExercise,
  loadFootballWorkout, 

  workoutStartTime,
  elapsedTime,

} = useWorkout(
  metrics,
  footballProgram
);

const {
  favoriteExercises,
  setFavoriteExercises,
} = useFavorites();

const {
  streak,
  setStreak,
  achievements,
  achievementPopup,
  quests,
  setQuests,
  unlockWorkout,
} = useProgression(
  metrics,
  workoutHistory,
  awardXP
);

const {

  weeklyWorkoutCount,

  latestWorkout,

  personalRecords,

  strongestLift,

  mostTrainedExercise,

} = useDashboardStats(workoutHistory);



// =====================
// Save System
// =====================

const workoutsLogged = workoutHistory.length;

const dailyCountdown =
  formatCountdown(getDailyResetTime());

const weeklyCountdown =
  formatCountdown(getWeeklyResetTime());

// ================================
// Workout Editing
// ================================


function toggleFavorite(exerciseName) {

  setFavoriteExercises((prev) => {

    let updated;

    if (prev.includes(exerciseName)) {

      updated = prev.filter(
        (exercise) => exercise !== exerciseName
      );

    } else {

      updated = [
        ...prev,
        exerciseName,
      ];

    }

    checkQuests({
  quests,
  setQuests,
  workoutHistory,
  metrics,
  changedMetric: null,
  currentWorkout: null,
  favoriteExercises: updated,
  awardXP,
});

    return updated;

  });

}


  function finishWorkout(){


    if(currentWorkout.length===0){

      alert("No workout yet.");

      return;

    }



    const workout = {

  id: crypto.randomUUID(),

  date: new Date().toISOString(),

  duration: elapsedTime,

  exercises: structuredClone(currentWorkout)

};



    const updatedHistory=[

      workout,

      ...workoutHistory

    ];



    setWorkoutHistory(updatedHistory);

    syncPerformanceFromWorkout(
  workout,
  metrics,
  setMetrics,
  performanceHistory,
  setPerformanceHistory,
  
  (pr) => {
    setNewPR(pr);
  }

);



    unlockWorkout(
  updatedHistory,
  favoriteExercises
);

const workoutLoad =
  currentWorkout.reduce(
    (total, exercise) =>
      total + exercise.sets.length,
    0
  );

let recoveryPenalty = 0;

if (workoutLoad >= 25)
  recoveryPenalty = 12;

else if (workoutLoad >= 18)
  recoveryPenalty = 8;

else if (workoutLoad >= 10)
  recoveryPenalty = 5;

else recoveryPenalty = 2;

updateRecovery(
  "energy",
  Math.max(
    1,
    Number(recovery.energy) -
      Math.ceil(recoveryPenalty / 3)
  )
);

updateRecovery(
  "soreness",
  Math.min(
    10,
    Number(recovery.soreness) +
      Math.ceil(recoveryPenalty / 4)
  )
);

    setWorkoutSummary(workout);

clearWorkout();

setPage("summary");

  }

  async function handleSignOut() {
  try {
    await signOut();
    setPage("dashboard");
  } catch (error) {
    console.error(
      "Sign out failed:",
      error
    );
  }
}

  if (authLoading) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-eyebrow">
          PROJECT DRIVE
        </div>

        <h1 className="auth-title">
          CONNECTING...
        </h1>

        <p className="auth-subtitle">
          Verifying athlete session.
        </p>
      </div>
    </div>
  );
}

if (!user) {
  return <AuthPage />;
}

  return (

    <div className="app">


      <Header {...player}/>

<div className="account-control">

  <div className="account-info">

    <span>
      ATHLETE ACCOUNT
    </span>

    <strong>
      {user.email}
    </strong>

  </div>

  <button
    type="button"
    className="sign-out-button"
    onClick={handleSignOut}
  >
    SIGN OUT
  </button>

</div>

<Navigation
  page={page}
  setPage={setPage}
/>



      {page==="dashboard" && (

        <Dashboard
          player={player}

          streak={streak}

          workoutsLogged={workoutsLogged}

          weeklyWorkoutCount={weeklyWorkoutCount}

          personalRecords={personalRecords}

          goals={goals}

          strongestLift={strongestLift}

          mostTrainedExercise={mostTrainedExercise}

          xp={displayXP}

          level={levelData.level}

          nextLevelXP={levelData.nextLevelXP}

          achievements={achievements}

          quests={quests}

          dailyCountdown={dailyCountdown}

          weeklyCountdown={weeklyCountdown}

          latestWorkout={latestWorkout}

          workoutHistory={workoutHistory}

          recoveryScore={recoveryScore}

          readiness={readiness}

          metrics={metrics}

        />

      )}



      {page==="workout" && (

        <WorkoutPage

          currentWorkout={currentWorkout}

          exercise={exercise}

          setExercise={setExercise}

          addExercise={addExercise}

          finishWorkout={finishWorkout}

          clearCurrentWorkout={clearWorkout}

          loadCategory={loadCategory}

          selectedCategory={selectedCategory}

          exerciseLibrary={exerciseLibrary}

          addTemplateExercise={addTemplateExercise}

          updateSet={updateSet}

          updateExerciseName={updateExerciseName}

          addSet={addSet}

          removeExercise={removeExercise}

          searchTerm={searchTerm}

          setSearchTerm={setSearchTerm}

          favoriteExercises={favoriteExercises}

          toggleFavorite={toggleFavorite}

          footballProgram={footballProgram}

          selectedWeek={selectedWeek}

          setSelectedWeek={setSelectedWeek}

          selectedDay={selectedDay}

          setSelectedDay={setSelectedDay}

          loadFootballWorkout={loadFootballWorkout}

          workoutStartTime={workoutStartTime}

          elapsedTime={elapsedTime}

        />

      )}

      {page === "summary" && (
  <WorkoutSummaryPage
    workout={workoutSummary}
    onContinue={() => {
  setWorkoutSummary(null);
  setPage("dashboard");
}}
  />
)}



      {page==="progress" && (

        <ProgressPage

          workoutHistory={workoutHistory}

          metrics={metrics}

          goals={goals}

          updateGoal={updateGoal}

        />

      )}



      {page==="performance" && (

        <PerformancePage

          metrics={metrics}

          updateMetric={updateMetric}

          goals={goals}

          updateGoal={updateGoal}

          workoutHistory={workoutHistory}

          performanceHistory={performanceHistory}

          saveMetricResult={saveMetricResult}

        />

      )}



      {page==="history" && (

        <HistoryPage

          workoutHistory={workoutHistory}

          updateWorkout={updateWorkout}

        />

      )}

      {page === "calendar" && (

  <CalendarPage
    workoutHistory={workoutHistory}
    performanceHistory={performanceHistory}
  />

)}

      {page==="profile" && (

        <ProfilePage
  player={player}
  updatePlayer={updatePlayer}
  updateSeasonGoal={updateSeasonGoal}
  streak={streak}
  workoutsLogged={workoutsLogged}
  xp={levelData.currentXP}
  level={levelData.level}
  nextLevelXP={levelData.nextLevelXP}
  achievements={achievements}
/>

      )}

      {page === "recruit" && (

  <RecruitProfilePage
    player={player}
    metrics={metrics}
    recruitProfile={recruitProfile}
    setRecruitProfile={setRecruitProfile}
    streak={streak}
    workoutsLogged={workoutsLogged}
    achievements={achievements}
    level={levelData.level}
    xp={levelData.currentXP}
  />

)}

{page === "coaching" && (

  <CoachingPage
  workoutHistory={workoutHistory}

  metrics={metrics}

  goals={goals}

  performanceHistory={performanceHistory}

  streak={streak}

  achievements={achievements}

  weeklyWorkoutCount={weeklyWorkoutCount}

  latestWorkout={latestWorkout}

  personalRecords={personalRecords}

  strongestLift={strongestLift}

  mostTrainedExercise={mostTrainedExercise}

  player={player}

  xp={levelData.currentXP}

  level={levelData.level}

  recovery={recovery}
updateRecovery={updateRecovery}
recoveryScore={recoveryScore}
readiness={readiness}
recoveryHistory={recoveryHistory}
saveRecoveryCheckIn={saveRecoveryCheckIn}
/>

)}

      {levelUpData && (
  <div
    className="level-up-overlay"
    role="dialog"
    aria-modal="true"
    aria-label={`Level ${levelUpData.newLevel} reached`}
  >
    <button
      type="button"
      className="level-up-popup"
      onClick={dismissLevelUp}
    >
      <span className="level-up-eyebrow">
        SYSTEM MESSAGE
      </span>

      <span className="level-up-title">
        LEVEL UP
      </span>

      <span className="level-up-level">
        LEVEL {levelUpData.newLevel}
      </span>

      <span className="level-up-message">
        Your abilities have increased.
      </span>

      <span className="level-up-dismiss">
        Click to continue
      </span>
    </button>
  </div>
)}

      {lastXPEvent && (
  <button
    type="button"
    className="xp-notification"
    onClick={dismissXPEvent}
    aria-label="Dismiss XP notification"
  >
    <span className="xp-notification-amount">
      +{lastXPEvent.amount} XP
    </span>

    <span className="xp-notification-reason">
      {lastXPEvent.reason}
    </span>
  </button>
)}



      {achievementPopup && (

        <div className="achievement-popup">

          <div className="achievement-popup-icon">

            {achievementPopup.icon}

          </div>


          <div>

            <h3>
              ACHIEVEMENT UNLOCKED
            </h3>


            <h2>
              {achievementPopup.title}
            </h2>


            <p>
              +{achievementPopup.xp} XP
            </p>

          </div>

        </div>

      )}

      {newPR && (
  <PRCelebration
    pr={newPR}
    onClose={() =>
      setNewPR(null)
    }
  />
)}


    </div>

  );

}


export default App;