import { Pressable, StyleSheet, Text, View, Modal } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { AirbnbRating } from "react-native-ratings";
import CommentPanel from "./CommentPanel";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/database/supabase";

interface Author {
  f_name: string | undefined;
  l_name: string | undefined;
}

interface Info {
  recipe_id: string | string[] | undefined;
  title: string | undefined;
  author: Author | undefined;
}

const RecipeHeader: React.FC<Info> = ({ recipe_id, title, author }) => {
  const { user } = useCurrentUser();

  const [likeStatus, setLikeStatus] = useState<boolean>(false);
  const [likeTrigger, setLikeTrigger] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(0);
  const [rateTotal, setRateTotal] = useState<number>(0);
  const [totalRate, setTotalRate] = useState<number>(0);

  const cooldown_rating = useRef(false);
  const cooldown_like = useRef(false);

  const handleLike = async () => {
    if (!recipe_id || !user?.user_id) return;
    if (cooldown_like.current) return;
    cooldown_like.current = true;

    const { data, error } = await supabase
      .from("like")
      .select("like_id")
      .eq("recipe_id", recipe_id)
      .eq("user_id", user.user_id)
      .single();

    // console.log("llll", data);

    if (data) {
      const { data: like_status, error } = await supabase
        .from("like")
        .delete()
        .eq("like_id", data.like_id);
      setLikeStatus(false);
    }

    if (!data) {
      const { data: like_status, error } = await supabase.from("like").insert({
        recipe_id,
        user_id: user.user_id,
      });
      setLikeStatus(true);
    }
    cooldown_like.current = false;
    setLikeTrigger(likeTrigger ? false : true);
  };

  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    const fetchLikeCount = async () => {
      const { data, error } = await supabase
        .from("like")
        .select("*")
        .eq("recipe_id", recipe_id);
      if (error) {
        console.log(error);
      }
      setLikeStatus(true);
      setLikeCount(data.length);
      const userLike = data.find(
        (like: { user_id: string }) => like.user_id === user?.user_id
      );
      setLikeStatus(userLike ? true : false);
    };
    fetchLikeCount();
  }, [likeTrigger]);

  const handleRating = async (value: number) => {
    if (!recipe_id || !user?.user_id) return;
    if (cooldown_rating.current) return;

    cooldown_rating.current = true;

    const { data, error } = await supabase
      .from("rating ")
      .select("rate_id")
      .eq("recipe_id", recipe_id)
      .eq("user_id", user.user_id)
      .single();

    if (data) {
      const { error: updateError } = await supabase
        .from("rating")
        .update({ rate: value })
        .eq("rate_id", data.rate_id);
    }

    if (!data) {
      const { data: newRatingData, error: insertError } = await supabase
        .from("rating")
        .insert({
          recipe_id: recipe_id,
          user_id: user.user_id,
          rate: value,
        })
        .select();
      setRating(value);
    }

    cooldown_rating.current = false;
  };

  useEffect(() => {
    const fetchRating = async () => {
      const rates = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
      };
      try {
        const { data, error } = await supabase
          .from("rating")
          .select("user_id, rate")
          .eq("recipe_id", recipe_id);

        if (error) throw error;
        if (data) {
          data.map((item: any) => {
            if (item.user_id == user?.user_id) {
              setRating(item.rate);
            }
            if (item.rate == 1) rates.one += 1;
            if (item.rate == 2) rates.two += 1;
            if (item.rate == 3) rates.three += 1;
            if (item.rate == 4) rates.four += 1;
          });
          const totalVotes = rates.one + rates.two + rates.three + rates.four;
          const totalScore =
            rates.one * 1 + rates.two * 2 + rates.three * 3 + rates.four * 4;
          const finalScore = (totalScore / totalVotes).toFixed(2);
          const handleNone =
            finalScore == "NaN"
              ? setRateTotal(0)
              : setRateTotal(parseFloat(finalScore));
          setTotalRate(totalVotes);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRating();
  }, [rating]);

  return (
    <View style={styles.bottom_panel}>
      <Text style={styles.recipe_title}>{title}</Text>
      <View style={styles.header2}>
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={{ fontFamily: "Poppins" }}>
            by {author?.f_name} {author?.l_name}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 5 }}
          >
            <AirbnbRating
              count={4}
              defaultRating={rating}
              size={20}
              showRating={false}
              onFinishRating={handleRating}
            />
            <Text style={{ fontFamily: "Poppins" }}>
              {totalRate}/{rateTotal}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Pressable
              style={{}}
              // onPress={() => handleLike()}
              android_ripple={{
                color: "rgba(0, 0, 0, 0.1)",
                borderless: false,
                radius: 17,
              }}
            >
              <MaterialCommunityIcons
                name="share-circle"
                size={24}
                color="black"
              />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Pressable
              style={{}}
              onPress={() => handleLike()}
              android_ripple={{
                color: "rgba(0, 0, 0, 0.1)",
                borderless: false,
                radius: 17,
              }}
            >
              <Entypo
                name="heart-outlined"
                size={25}
                color={likeStatus ? "#cc0066" : "#ccc"}
              />
            </Pressable>
            <Text style={{ fontFamily: "Poppins" }}>{likeCount}</Text>
          </View>
          <CommentPanel />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottom_panel: {
    position: "relative",
    top: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 0,
    flexDirection: "column",
    gap: 5,
  },
  recipe_title: {
    fontFamily: "Courgette",
    fontSize: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default RecipeHeader;
