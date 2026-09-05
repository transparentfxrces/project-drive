import React, { useMemo, useState } from "react";
import "../styles/ExerciseLibrary.css";
import positionProfiles from "../data/positionProfiles";

function ExerciseLibraryPage({
  player,
  exerciseLibrary = {},
  positionExercises = {},
}) {
  const [activeSection, setActiveSection] = useState("position");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedExercise, setExpandedExercise] = useState(null);

  const position = player?.position || "";
  const positionGroup = player?.positionGroup || "";

  // Find the position key from the actual positionProfiles structure.
  // Example: player.position === "Center" -> position key === "C"
  const positionCode = useMemo(() => {
    const group = positionProfiles[positionGroup];

    if (!group?.positions || !position) {
      return "";
    }

    const matchingEntry = Object.entries(group.positions).find(
      ([code, profile]) =>
        code.toUpperCase() === position.toUpperCase() ||
        profile?.label?.toLowerCase() === position.toLowerCase()
    );

    return matchingEntry?.[0] || "";
  }, [positionGroup, position]);

  const positionLabel = useMemo(() => {
    const profile =
      positionProfiles[positionGroup]?.positions?.[positionCode];

    return profile?.label || position || "Your Position";
  }, [positionGroup, positionCode, position]);

  const personalizedExercises = useMemo(() => {
    const exercises = positionExercises[positionCode] || [];

    return exercises.filter((exercise) =>
      exercise.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positionExercises, positionCode, searchTerm]);

  const allExercises = useMemo(() => {
    return Object.entries(exerciseLibrary)
      .map(([category, exercises]) => ({
        category,
        exercises: exercises.filter((exercise) =>
          exercise.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.exercises.length > 0);
  }, [exerciseLibrary, searchTerm]);

  function toggleExercise(exercise) {
    setExpandedExercise((current) =>
      current === exercise ? null : exercise
    );
  }

  return (
    <main className="exercise-library-page">
      <section className="exercise-library-hero">
        <div>
          <span className="exercise-library-eyebrow">
            PROJECT DRIVE // DEVELOPMENT
          </span>

          <h1>Exercise Library</h1>

          <p>
            Explore exercises and find supplemental work built around your
            position.
          </p>
        </div>

        <div className="exercise-library-position">
          <span>POSITION</span>
          <strong>{positionLabel}</strong>
        </div>
      </section>

      <section className="exercise-library-controls">
        <div className="exercise-library-tabs">
          <button
            type="button"
            className={activeSection === "position" ? "active" : ""}
            onClick={() => setActiveSection("position")}
          >
            Position Development
          </button>

          <button
            type="button"
            className={activeSection === "all" ? "active" : ""}
            onClick={() => setActiveSection("all")}
          >
            Full Library
          </button>
        </div>

        <label className="exercise-library-search">
          <span>Search exercises</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
          />
        </label>
      </section>

      {activeSection === "position" ? (
        <section className="exercise-library-section">
          <div className="exercise-library-section-heading">
            <div>
              <span className="exercise-library-eyebrow">
                PERSONALIZED
              </span>
              <h2>{positionLabel} Development</h2>
            </div>

            <span className="exercise-library-count">
              {personalizedExercises.length} exercises
            </span>
          </div>

          {personalizedExercises.length > 0 ? (
            <div className="exercise-library-grid">
              {personalizedExercises.map((exercise) => (
                <button
                  type="button"
                  className={`exercise-library-card ${
                    expandedExercise === exercise ? "expanded" : ""
                  }`}
                  key={exercise}
                  onClick={() => toggleExercise(exercise)}
                >
                  <span className="exercise-library-card-top">
                    <span className="exercise-library-icon">◆</span>

                    <span className="exercise-library-badge">
                      {positionLabel}
                    </span>
                  </span>

                  <strong>{exercise}</strong>

                  <span className="exercise-library-card-footer">
                    {expandedExercise === exercise
                      ? "Selected"
                      : "View exercise"}

                    <span>→</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="exercise-library-empty">
              <strong>No position exercises found.</strong>

              <span>
                Finish your athlete profile or try another search.
              </span>
            </div>
          )}
        </section>
      ) : (
        <section className="exercise-library-section">
          <div className="exercise-library-section-heading">
            <div>
              <span className="exercise-library-eyebrow">
                TRAINING DATABASE
              </span>

              <h2>Full Exercise Library</h2>
            </div>
          </div>

          {allExercises.length > 0 ? (
            <div className="exercise-library-categories">
              {allExercises.map(({ category, exercises }) => (
                <div
                  className="exercise-library-category"
                  key={category}
                >
                  <div className="exercise-library-category-heading">
                    <h3>{category}</h3>
                    <span>{exercises.length}</span>
                  </div>

                  <div className="exercise-library-list">
                    {exercises.map((exercise) => (
                      <button
                        type="button"
                        className={`exercise-library-list-item ${
                          expandedExercise === exercise ? "expanded" : ""
                        }`}
                        key={exercise}
                        onClick={() => toggleExercise(exercise)}
                      >
                        <span>{exercise}</span>

                        <span>
                          {expandedExercise === exercise ? "−" : "+"}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="exercise-library-empty">
              <strong>No exercises found.</strong>
              <span>Try a different search.</span>
            </div>
          )}
        </section>
      )}

      <section className="exercise-library-note">
        <div className="exercise-library-note-icon">i</div>

        <div>
          <strong>How this fits Project Drive</strong>

          <p>
            Your normal Workout stays focused on the coach/team program.
            This library is for exploring exercises and building supplemental
            position development.
          </p>
        </div>
      </section>
    </main>
  );
}

export default ExerciseLibraryPage;