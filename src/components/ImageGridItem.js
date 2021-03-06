import React, { useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";

// import Video from "react-native-video";
import Video from "react-native-video-player";
import firestore from "@react-native-firebase/firestore";
import FeatherIcon from "react-native-vector-icons/Feather";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const ActivityIndicatorElement = () => {
  return (
    <View style={{ flex: 1, height: windowHeight / 1.85 }}>
      <ActivityIndicator style={{ marginTop: 200 }} color="#000" size="large" />
    </View>
  );
};

export default (props) => {
  let vidRef = null;
  const [isMounted, setIsMounted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);

  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // React.useEffect(() => {
  //   if (props.myIndex != props.currentlyPlaying) {
  //     vidRef.pause();
  //   }
  // }, [props.currentlyPlaying]);

  // React.useEffect(() => {
  //   if (props.myIndex === props.currentVisibleVideo) {
  //     vidRef.resume();
  //   } else {
  //     vidRef.pause();
  //   }
  // }, [props.currentVisibleVideo]);

  React.useEffect(() => {
    if (props.myIndex === props.currentVisibleVideo) {
      isMounted && setIsBuffering(false);
      setTimeout(() => vidRef && vidRef.resume(), 1500);
    } else {
      // isMounted && setIsBuffering(true);
      setTimeout(() => vidRef && vidRef.pause(), 1500);
    }
  }, [props.currentVisibleVideo]);

  const onProgress = (data) => {
    if (
      data.playableDuration !== 0 &&
      data.playableDuration < data.currentTime
    ) {
      isMounted && setIsBuffering(true);
    } else {
      isMounted && setIsBuffering(false);
    }
  };

  const videoError = ($event) => {
    console.log("videoError", $event);
  };
  return (
    <>
      {isBuffering ? (
        <ActivityIndicatorElement />
      ) : (
        <>
          <Video
            thumbnail={{ uri: props.item.thumbnail }}
            endWithThumbnail
            ref={(inpt) => (vidRef = inpt)}
            style={{
              flex: 1,
              height: windowHeight / 1.95,
              borderWidth: 1,
              borderColor: "#a6a6a6",
            }}
            wrapper
            resizeMode={"cover"}
            video={{ uri: props.item.videoUrl }}
            // video={{
            //   uri: "https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
            // }}
            poster={props.item.thumbnail}
            pauseOnPress={true}
            posterResizeMode={"contain"}
            fullscreenAutorotate={false}
            fullScreenOnLongPress={false}
            defaultMuted={true}
            disableControlsAutoHide={true}
            autoplay={true}
            paused={props.myIndex === props.currentVisibleVideo ? false : true}
            onError={videoError}
            onProgress={onProgress}
            onReadyForDisplay={() => {
              setIsBuffering(false);
              props.setPlaying(props.myIndex);
              const updtaedViews = (props.noOfViews || 0) + 1;
              firestore()
                .collection("contest")
                .doc(props.item.id)
                .update({
                  views: updtaedViews,
                })
                .then(() => {
                  props.setNoOfViewsMap(updtaedViews);
                });
            }}
          />
          {props.item.contest ? (
            <Text style={styles.contestBadge}>
              <FeatherIcon
                name="award"
                size={15}
                color="white"
                style={{ textAlign: "left" }}
              />{" "}
              In Contest as {props.item.contest}
            </Text>
          ) : (
            <></>
          )}
        </>
      )}

      {/* <Video
      resizeMode={'cover'}
      //onLoad={itm => {console.log(`${itm}`)}}
      style={{flex: 1, height: windowHeight / 1.85}}
      fullScreenOnLongPress={false}
      defaultMuted={true}
      ref={(inpt) => (vidRef = inpt)}
      onHideControls={() => {
        props.setPlaying(props.myIndex);
        // console.log(props.noOfViewsMap);
        firestore()
          .collection('contest')
          .doc(props.item.id)
          .get()
          .then((res) => {
            const prevData = res.data();
            firestore()
              .collection('contest')
              .doc(props.item.id)
              .update({
                views: prevData.views + 1,
              });
            // props.setNoOfViewsMap(
            //   prevData.id,
            //   prevData.views ? prevData.views : 0,
            // );
          });
      }}
      onShowControls={() => {
        props.setPlaying(props.myIndex);
        //console.log(props.noOfViewsMap);
        // console.log('duration', props.item.duration);
        // firestore()
        //   .collection('contest')
        //   .doc(props.item.id)
        //   .get()
        //   .then((res) => {
        //     const prevData = res.data();
        //     firestore()
        //       .collection('contest')
        //       .doc(props.item.id)
        //       .update({
        //         views: prevData.views + 1,
        //       });
        //     props.setNoOfViewsMap(
        //       prevData.id,
        //       prevData.views ? prevData.views : 0,
        //     );
        //   });
      }}
      onStart={() => {
        props.setPlaying(props.myIndex);
        const updtaedViews = (props.noOfViews || 0) + 1;
        firestore()
          .collection('contest')
          .doc(props.item.id)
          .update({
            views: updtaedViews,
          })
          .then(() => {
            props.setNoOfViewsMap(updtaedViews);
          });
      }}
      thumbnail={{uri: props.item.thumbnail}}
      endWithThumbnail
      disableControlsAutoHide={true}
      video={{uri: props.item.videoUrl}}
      autoplay={true}
      paused={props.myIndex === props.currentVisibleVideo ? false : true}
    /> */}
    </>
  );
};

const styles = StyleSheet.create({
  activityIndicatorStyle: {
    flex: 1,
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  contestBadge: {
    flex: 2,
    top: 0,
    backgroundColor: "#829c30",
    color: "white",
    padding: 5,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "right",
  },
});
