import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

export default function usePlayer() {
  const defaultPlayer = {
    name: "Jason",
    grade: "Rising Junior",
    graduationYear: "2027",
    school: "BTHS",
    team: "Varsity Football",
    position: "Offensive Line",
    jersey: "72",
    height: `6'1"`,
    weight: "245",
    dominantHand: "Right",
    gpa: "4.5",

    seasonGoals: [
      "Increase strength",
      "Improve consistency",
      "Stay injury free",
      "Dominate this season 🏈",
    ],
  };

  const [player, setPlayer] = useState(defaultPlayer);
  const [loading, setLoading] = useState(true);

  // Load profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error loading profile:", error);
        setLoading(false);
        return;
      }

      setPlayer((prev) => ({
        ...prev,
        name: data.name ?? prev.name,
        grade: data.grade ?? prev.grade,
        graduationYear: data.graduation_year ?? prev.graduationYear,
        school: data.school ?? prev.school,
        team: data.team ?? prev.team,
        position: data.position ?? prev.position,
        jersey: data.jersey ?? prev.jersey,
        height: data.height ?? prev.height,
        weight: data.weight ?? prev.weight,
        dominantHand: data.dominant_hand ?? prev.dominantHand,
        gpa: data.gpa ?? prev.gpa,
      }));

      setLoading(false);
    }

    loadProfile();
  }, []);

  // Save profile changes to Supabase
  async function updatePlayer(updatedPlayer) {
    setPlayer(updatedPlayer);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: updatedPlayer.name,
        grade: updatedPlayer.grade,
        graduation_year: updatedPlayer.graduationYear,
        school: updatedPlayer.school,
        team: updatedPlayer.team,
        position: updatedPlayer.position,
        jersey: updatedPlayer.jersey,
        height: updatedPlayer.height,
        weight: updatedPlayer.weight,
        dominant_hand: updatedPlayer.dominantHand,
        gpa: updatedPlayer.gpa,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
    }
  }

  function updateSeasonGoal(index, value) {
    setPlayer((prev) => ({
      ...prev,
      seasonGoals: prev.seasonGoals.map((goal, i) =>
        i === index ? value : goal
      ),
    }));
  }

  return {
    player,
    updatePlayer,
    updateSeasonGoal,
    loading,
  };
}