// import feed from "../../../feed";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Post from "./Post";

const feed = [
  {
    title: "The Last Sunset",
    body: "A drama about a young woman returning to her small town to reconcile with her estranged father before he passes away. The story explores themes of family, regret, and forgiveness.",
    postedBy: "FilmmakerX",
    likes: 10,
    shares: 5,
    comments: [
      {
        author: "FilmFan123",
        comment:
          "Sounds like an emotional rollercoaster! What’s the setting like?",
        likes: 2,
        replies: [
          {
            author: "FilmmakerX",
            reply:
              "The town is small and picturesque, with a lot of charm, but also a sense of isolation that adds to the emotional weight of the story.",
          },
        ],
      },
      {
        author: "CinemaLover",
        comment:
          "Would love to see how you handle the father-daughter dynamic. Could be really touching.",
        likes: 4,
        replies: [],
      },
    ],
  },
  {
    title: "Urban Legends",
    body: "A psychological thriller set in the heart of a bustling city where a detective investigates a series of seemingly unrelated murders that all point to an urban legend coming to life.",
    postedBy: "ThrillerMinded",
    likes: 8,
    shares: 7,
    comments: [
      {
        author: "MysteryEnthusiast",
        comment: "Sounds intriguing! What’s the twist at the end?",
        likes: 4,
        replies: [
          {
            author: "ThrillerMinded",
            reply:
              "I can’t spoil the twist just yet, but it’s definitely something no one will see coming!",
          },
        ],
      },
      {
        author: "ThrillerLover",
        comment: "If it’s like 'Se7en', I’m definitely in!",
        likes: 3,
        replies: [],
      },
    ],
  },
  {
    title: "A Dream Unfolds",
    body: "This story follows an aspiring artist from a small town who dreams of making it big in the art world. But as she faces rejection and adversity, she begins to question her self-worth and the cost of chasing her dreams.",
    postedBy: "ArtistVision",
    likes: 7,
    shares: 3,
    comments: [
      {
        author: "ArtLover22",
        comment:
          "This feels so relatable! I'm sure a lot of artists can connect with this.",
        likes: 2,
        replies: [
          {
            author: "ArtistVision",
            reply:
              "I’m glad you feel that way! The journey of an artist is never easy, but it’s one filled with so much passion.",
          },
        ],
      },
      {
        author: "InspireMe",
        comment:
          "I can already feel the struggle and inspiration! What does the climax look like?",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    title: "Chasing Echoes",
    body: "A war veteran returns home after years of absence and struggles to reintegrate into civilian life. The trauma he faces forces him to confront his past while attempting to reconnect with his estranged family.",
    postedBy: "RealWarStories",
    likes: 9,
    shares: 6,
    comments: [
      {
        author: "WarriorSoul",
        comment:
          "This seems like a powerful story. How does the protagonist overcome his trauma?",
        likes: 4,
        replies: [
          {
            author: "RealWarStories",
            reply:
              "The protagonist faces his trauma head-on, through therapy, confronting past events, and ultimately finding reconciliation with his family.",
          },
        ],
      },
      {
        author: "LifeAfterWar",
        comment:
          "A very timely story, especially with the number of vets returning today.",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    title: "The Silent Witness",
    body: "A woman who witnesses a crime in her neighborhood must decide whether to report what she saw, risking her own safety and putting her family in danger, or remain silent and live with the guilt.",
    postedBy: "CrimeThrillerFan",
    likes: 11,
    shares: 4,
    comments: [
      {
        author: "JusticeSeeker",
        comment: "Such a morally complex dilemma. What does she end up doing?",
        likes: 6,
        replies: [
          {
            author: "CrimeThrillerFan",
            reply:
              "You’ll have to watch the story to find out, but let’s just say it’s a decision that will stay with her forever.",
          },
        ],
      },
      {
        author: "SuspenseFan",
        comment: "This could make for a thrilling movie. I’m hooked!",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    title: "Eclipsed Dreams",
    body: "A scientist discovers a way to travel back in time, but soon realizes that changing the past comes with unintended consequences that threaten to destroy the future.",
    postedBy: "SciFiDreamer",
    likes: 13,
    shares: 9,
    comments: [
      {
        author: "SciFiFan",
        comment:
          "Time travel stories always have so many layers. Is this more of a thriller or drama?",
        likes: 4,
        replies: [
          {
            author: "SciFiDreamer",
            reply:
              "It’s a mix of both! There’s definitely a thrilling element, but the emotional weight of the consequences adds to the drama.",
          },
        ],
      },
      {
        author: "TechieGenius",
        comment:
          "I love how these stories always make you think about the consequences of our actions.",
        likes: 9,
        replies: [],
      },
    ],
  },
  {
    title: "The Road Less Traveled",
    body: "A biographical film based on the life of a well-known figure who abandoned their high-paying job to pursue a career in a completely different field, facing the challenges of societal expectations and personal fulfillment.",
    postedBy: "BioFilmMaker",
    likes: 5,
    shares: 3,
    comments: [
      {
        author: "BioFan",
        comment:
          "Love a good biopic! What’s the key turning point in their career change?",
        likes: 3,
        replies: [
          {
            author: "BioFilmMaker",
            reply:
              "The turning point comes when they experience a major personal crisis that forces them to reevaluate their values and purpose.",
          },
        ],
      },
      {
        author: "LifeChanger",
        comment:
          "This story resonates so much. I made a similar decision to follow my passion!",
        likes: 2,
        replies: [],
      },
    ],
  },
  {
    title: "Beyond the Stars",
    body: "A story about a young astronaut who dreams of exploring the unknown reaches of space, only to find herself in a race against time when a catastrophe threatens the lives of her crew and the future of mankind.",
    postedBy: "SpaceExplorer",
    likes: 14,
    shares: 8,
    comments: [
      {
        author: "SpaceFan",
        comment:
          "This could be a great mix of science and human drama! What’s the central conflict?",
        likes: 7,
        replies: [
          {
            author: "SpaceExplorer",
            reply:
              "The central conflict revolves around the astronaut trying to make life-or-death decisions to save her crew while dealing with her own personal doubts and fears.",
          },
        ],
      },
      {
        author: "FutureExplorer",
        comment:
          "Space stories are always captivating. Will there be a twist in the storyline?",
        likes: 6,
        replies: [],
      },
    ],
  },
  {
    title: "Shadows of the Past",
    body: "A detective is pulled into an old cold case when new evidence surfaces, revealing a web of secrets and lies that could change everything he thought he knew about the victim.",
    postedBy: "DetectiveMind",
    likes: 6,
    shares: 4,
    comments: [
      {
        author: "ColdCaseFan",
        comment:
          "I love stories with layers of secrets! What’s the big reveal?",
        likes: 4,
        replies: [
          {
            author: "DetectiveMind",
            reply:
              "The big reveal is that the victim wasn’t the innocent person everyone thought they were, and the real culprit might be someone the detective trusted.",
          },
        ],
      },
      {
        author: "DetectiveFan",
        comment:
          "Sounds like a gripping story. Could be a great procedural drama!",
        likes: 2,
        replies: [],
      },
    ],
  },
];

const HomeScreen = () => {
  const [showAllReplies, setShowAllReplies] = useState(false);

  const handleToggleReplies = () => {
    setShowAllReplies((prevState) => !prevState);
  };

  const renderItem = ({ item }) => {
    return (
      <Post
        item={item}
        showAllReplies={showAllReplies}
        handleToggleReplies={handleToggleReplies}
      />
    );
  };

  return (
    <FlatList
      data={feed}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default HomeScreen;
