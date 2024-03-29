import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import HeaderIndex from "src/common/HeaderIndex";
import FooterIndex from "src/common/FooterIndex";

import { ComponentStyles } from "src/common/ContainerStyles";
import ConfigSetup from "src/common/ConfigSetup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TutorBox from "src/components/TutorBox";
import api from "../api";
// here is the detail of food point
const Scan_2 = (props) => {
  //fields
  const [title, setTitle] = useState("Title");
  const [point, setPoint] = useState("Point");
  const [data, setData] = useState([]);
  const [hasNext, setHasNext] = useState(undefined);

  const titleobj = [
    {
      id: "1",
      title: "Chicken",
      point: "50",
    },
    {
      id: "2",
      title: "Local",
      point: "25",
    },
    {
      id: "3",
      title: "No Plastic",
      point: "50",
    },
  ];
  const [totalPoint, setTotalPoint] = useState(0);

  //fetching data
  const fetchingData = async () => {
    api
      .get("/api/user/cal")
      .then((response) => {
        console.log("data", response.data);
        const rankData = response.data;
        setData(rankData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const setPropsData = (pass) => {
    setData(pass);
    console.log("passData", data);
  };
  useEffect(() => {
    // for counting the point added to the total the user has
    //setData(titleobj);

    const clearData = props.navigation.addListener("focus", () => {
      setPropsData(props.route.params.food);
      //setTitle("");
      //setPoint("");
      //fetchingData();
    });
    return () => {
      clearData;
    };
  }, [props.navigation]);
  //any params in route, set value
  useEffect(() => {
    if (props.route.params) {
      if (props.route.params.countHelp) {
        setHasNext(parseInt(JSON.stringify(props.route.params.countHelp)));
      } else {
        setHasNext(0);
      }
    }
  });

  useEffect(() => {
    const clearData = props.navigation.addListener("blur", () => {
      setHasNext(0);
    });
    return clearData;
  }, [props.navigation]);
  return (
    <>
      <HeaderIndex navigation={props.navigation} />
      <View style={[ComponentStyles.container_v2, { alignItems: "center" }]}>
        <View style={styles.scanedCotainer}>
          <Text style={styles.scanText}>Result</Text>
          {/*
                        list.map(function(){
                            return <ScanedCotainer/>
                        })
                        */}
          <FlatList
            data={data}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item }) => {
              let country = item.country ? item.country : "";
              let type = item.point ? item.point : "";
              return (
                <>
                  <View style={styles.scanContainer}>
                    <Text style={styles.foodTitle}>
                      {item.name} +{item.score}
                    </Text>
                    <Text style={styles.foodContent}>From {country.name}</Text>
                    <Text style={styles.foodContent}>Type {type.name}</Text>
                  </View>
                </>
              );
            }}
          />

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.scanBtnContainer}>
              <Text style={styles.scanBtnText}>Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportBtnContainer}
              onPress={() => props.navigation.navigate("Report")}
            >
              <Text style={styles.reportText}>Report Problem</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FooterIndex style={styles.footer} navigation={props.navigation} />
      {hasNext === 1 && (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            position: "absolute",
          }}
        ></View>
      )}
      {hasNext === 1 && (
        <TutorBox
          mouseNum={1}
          text={
            "Both method will tell you the net point you earned and the reason."
          }
          mouse1left={200}
          mouse1top={200}
          circle={0}
          navigation={props.navigation}
          isPlace={1}
          place={"Rank"}
          boxtop={100}
          haveCount={0}
          hasNext={1}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 84,
  },
  scanContainer: {
    backgroundColor: "rgba(255, 255, 255,0.3)",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 30,
    height: 150,
    marginTop: 20,
    width: 298,
  },
  scanText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#309397",
    textTransform: "uppercase",
  },
  scanBtnContainer: {
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    width: 170,
    backgroundColor: "#309397",
    //flexDirection : "row",
    marginTop: 50,
    alignItems: "center",
  },
  scanBtnText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  scanCam: {
    marginRight: 10,
    marginLeft: 10,
  },
  qrImage: {
    marginTop: 50,
  },
  foodTitle: {
    textAlign: "center",
    fontSize: 24,
    marginTop: 10,
    color: "#FF6319",
    fontWeight: "bold",
  },
  foodContent: {
    marginHorizontal: 30,
    marginVertical: 10,
  },
  reportText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  reportBtnContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#309397",
    padding: 10,
    width: 170,
    //flexDirection : "row",
    marginTop: 30,
    alignItems: "center",
  },
});
export default Scan_2;
