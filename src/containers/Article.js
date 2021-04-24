import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import HeaderIndex from "src/common/HeaderIndex";
import FooterIndex from "src/common/FooterIndex";
import { ComponentStyles } from "src/common/ContainerStyles";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SavePost from "src/common/SavePost";
import TutorBox from "src/components/TutorBox";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ConfigSetup from "src/common/ConfigSetup";
import api from "../api";
const ScreenHight = Dimensions.get("screen").height;

//this is the article page
const Articles = (props) => {
  const [post, setPost] = useState("");
  const [helpCount, setHelpCount] = useState(undefined);
  const [hasNext, setHasNext] = useState(undefined);
  //const [text , setDData] = useState("");
  const [index, setIndex] = useState(0); // use to show the index of article
  const [currentText, setText] = useState(""); // use to set the current index article title
  const [currentContent, setContent] = useState(""); // use to set the current index article content

  const testArt = [
    {
      id: 1,
      title: "Demo Article",
      content:
        "Demo ContentDemContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemooContentDemContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoContenDemoo ContenDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContenttDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo ContentDemo Content",
      author: "Brian Wong",
    },
    {
      id: 2,
      title: "Demo Article2",
      content: "Demo Content2",
      author: "Brian Wong",
    },
    {
      id: 3,
      title: "Demo Article3sadsadddasasdasadadadsads",
      content: "Seee",
      author: "Brian Wong",
    },
  ];

  // for fetching the data
  const fetchData = () => {
    api
      .get("/api/articles")
      .then((response) => {
        console.log("data article", response.data);

        const articleData = response.data;
        setPost(articleData);
        setText(text[index].title);
        setContent(text[index].content);
      })
      .catch((error) => {
        console.log("Fail in article ", error);
      });

    console.log("now post", post);
  };

  // this is for update the title and content, when index change
  const text = testArt;
  //this is for add the save to save post
  const addSave = () => {
    try {
      SavePost.set(text[index]);
      console.log("ADDed ", SavePost.get());
    } catch (e) {
      console.error(e);
    }
  };
  //this is for going to write article page
  const write = () => {
    props.navigation.navigate("Write");
  };
  // here is for set the tutor box parameter and render
  useEffect(() => {
    if (props.route.params) {
      // check any params in route
      console.log(props.route.params);
      if (props.route.params.helpCount) {
        console.log("has enter helpCount");
        setHelpCount(
          (helpCount) =>
            (helpCount = parseInt(JSON.stringify(props.route.params.helpCount)))
        );
      } else {
        setHelpCount(undefined);
        console.log("nothing has enter helpCount");
      }

      if (props.route.params.countHelp) {
        console.log("has enter hasNext");
        setHasNext(
          (hasNext) =>
            (hasNext = parseInt(JSON.stringify(props.route.params.countHelp)))
        );
      } else {
        setHasNext(0);
        console.log("nothing has enter hasNext");
      }
    }
    console.log("has add", hasNext);
    console.log("has add", helpCount);
  });

  // here is to clear data when leave the current screen
  useEffect(() => {
    const clearData = props.navigation.addListener("blur", () => {
      setHelpCount(undefined);
      setHasNext(0);
      props.navigation.setParams({
        helpCount: null,
        hasNext: null,
        countHelp: null,
      });
    });

    const focus = props.navigation.addListener("focus", () => {
      fetchData();
    });

    return () => {
      focus;
      clearData;
    };
  }, [props.navigation]);
  useEffect(() => {
    console.log("have post", post);

    setText(text[index] ? text[index].title : "Nn");
    setContent(text[index] ? text[index].content : "Nn");
  }, [index]);

  return (
    <>
      <HeaderIndex navigation={props.navigation} />

      <View style={[ComponentStyles.container_v2, { alignItems: "center" }]}>
        <Text style={styles.newsTitle}>What's new today?</Text>
        <View style={styles.newsContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.text}>{currentText}</Text>

            <View style={{ borderWidth: 1, position: "absolute", right: 0 }}>
              <TouchableOpacity onPress={() => addSave()}>
                <Image
                  source={require("src/assets/images/icon_favour.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.newsContext}>
            <Text style={styles.content}>{currentContent}</Text>
            <TouchableOpacity
              onPress={() => {
                console.log("now passing title ", text[index].title);
                console.log("now passing content ", text[index].content);
                props.navigation.navigate("ArticleDetail", {
                  // pass the params to article detail page
                  title: text[index].title,
                  content: text[index].content,
                  author: text[index].author,
                });
              }}
            >
              <Text
                style={{ textAlign: "center", fontSize: 25, color: "#2676ff" }}
              >
                More...
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextArrowContainer}
          onPress={() => {
            //here is to change the index
            setIndex((index) => (index < 1 ? index + 1 : (index = 0)));
            setText(text[index].title);
            setContent(text[index].content);
            console.log("" + index);
          }}
        >
          <Image source={require("src/assets/images/icon_next.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backArrowContainer}
          onPress={() => {
            //here is to change the index
            setIndex((index) => (index > 0 ? index - 1 : (index = 1)));
            console.log("" + index);
          }}
        >
          <Image source={require("src/assets/images/icon_back.png")}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={styles.write} onPress={() => write()}>
          <Image source={require("src/assets/images/icon_favour.png")}></Image>
        </TouchableOpacity>
      </View>

      <FooterIndex
        style={styles.footer}
        navigation={props.navigation}
        points={5000}
        route={props.route}
      />
      {
        // following is for the tutor box setting
        hasNext === 1 && (
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.7)",
              position: "absolute",
            }}
          ></View>
        )
      }
      {helpCount === undefined && hasNext === 1 ? (
        <TutorBox
          mouseNum={1}
          text={"You can read the latest article about decarbonization here!"}
          mouse1left={wp("2%")}
          mouse1top={hp("52%")}
          circle={1}
          navigation={props.navigation}
          isPlace={1}
          place={"Article"}
          boxtop={100}
          haveCount={1}
          nowCount={1}
        />
      ) : helpCount === 1 ? (
        <TutorBox
          mouseNum={1}
          text={"Also pressing the heart to save the article you like"}
          mouse1left={280}
          mouse1top={hp("28%")}
          circle={1}
          navigation={props.navigation}
          isPlace={1}
          place={"Article"}
          boxtop={100}
          haveCount={1}
          nowCount={2}
        />
      ) : helpCount === 2 ? (
        <TutorBox
          mouseNum={1}
          text={"You can read the article you have saved by passing here."}
          mouse1left={Dimensions.get("screen").width - 70}
          mouse1top={hp("5.5%")}
          circle={1}
          navigation={props.navigation}
          isPlace={1}
          place={"Save"}
          boxtop={100}
          haveCount={0}
          hasNext={1}
        />
      ) : (
        helpCount === 3 && (
          <TutorBox
            mouseNum={1}
            text={"You can write your own article tips to the others here."}
            mouse1left={Dimensions.get("screen").width - 130}
            mouse1top={hp("28%")}
            circle={1}
            navigation={props.navigation}
            isPlace={1}
            place={"Write"}
            boxtop={100}
            haveCount={0}
            hasNext={1}
          />
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: hp("10%"),
  },
  newsTitle: {
    marginTop: 40,
    fontSize: hp("3.5%"),
    color: "#f5f5f5",
  },
  newsContainer: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 50,

    marginVertical: 50,
    marginHorizontal: 5,
    padding: 15,
    width: wp("65%"),
    height: hp("58%"),
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "stretch",
  },
  text: {
    fontSize: hp("3.3%"),
    fontWeight: "bold",
    flexDirection: "row",
  },
  content: {
    fontSize: hp("2.7%"),
  },

  nextArrowContainer: {
    borderWidth: 3,
    borderTopColor: "black",
    height: hp("5.5%"),
    width: wp("12%"),
    right: wp("2%"),
    top: hp("40%"),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  backArrowContainer: {
    borderWidth: 3,
    borderTopColor: "black",
    height: hp("5.5%"),
    width: wp("12%"),
    left: wp("2%"),
    top: hp("40%"),
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  write: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "black",
    right: hp("3%"),
    top: hp("4.5%"),
  },
  titleContainer: {
    flexDirection: "row",
  },
  newsContext: {
    height: hp("40%"),
  },
});
export default Articles;
