import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API, KEY } from "./app/Constants";
import styles from "./app/style";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
export default function App() {
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(1);
  const [state, setState] = useState({
    s: "",
    results: [],
    selected: {},
  });
  const [movies, setMovies] = useState({
    movielist: [],
  });
  const [similar, setSimilar] = useState([]);
  const fetchData = () => {
    setLoading(true);
    axios
      .get(API + "/movie/now_playing", {
        params: {
          api_key: KEY,
          page: offset,
        },
      })
      .then(({ data }) => {
        setOffset(offset + 1);
        let movielist = data.results;
        setMovies((prevState) => {
          return { ...prevState, movielist: movielist };
        });
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const updateSelectedMovie = (movie) => {
    setState((prevState) => {
      return { ...prevState, selected: movie };
    });
  };

  const openMovie = (result) => {
    updateSelectedMovie(result);
    axios
      .get(API + "/movie/" + result.id + "/similar", {
        params: {
          api_key: KEY,
        },
      })
      .then(({ data }) => {
        let similarmovies = data.results;
        // console.log(data);
        setSimilar(similarmovies);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Movies App</Text>
      <StatusBar style="auto" />

      <ScrollView style={styles.result}>
        {movies.movielist.map((result) => (
          <TouchableHighlight
            activeOpacity={0.7}
            underlayColor="hsl(205, 77%, 27%)"
            key={result.id}
            onPress={() => openMovie(result)}
          >
            <View style={styles.result}>
              <Image
                source={{
                  uri: "https://image.tmdb.org/t/p/w500" + result.poster_path,
                }}
                style={{
                  width: "100%",
                  height: 300,
                }}
                resizeMode="cover"
              />
              <Text style={styles.heading}>{result.title}</Text>
            </View>
          </TouchableHighlight>
        ))}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={fetchData}
            style={styles.loadMoreBtn}
          >
            <Text style={styles.btnText}>Load More</Text>
            {loading ? (
              <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={false}
        visible={typeof state.selected.title != "undefined"}
      >
        <ScrollView style={styles.result}>
          <View style={styles.popup}>
            <Text style={styles.movietitle}>{state.selected.title}</Text>
            <Image
              source={{
                uri:
                  "https://image.tmdb.org/t/p/w500" +
                  state.selected.poster_path,
              }}
              style={{
                width: "100%",
                height: 300,
                marginBottom: 10,
              }}
              resizeMode="cover"
            />
            <Text
              style={{
                marginBottom: 10,
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Release Date: {state.selected.release_date}
            </Text>
            <Text>Description: {state.selected.overview}</Text>
          </View>
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#fff"
            onPress={() =>
              setState((prevState) => {
                return { ...prevState, selected: {} };
              })
            }
          >
            <Text style={styles.closebtn}>Close</Text>
          </TouchableHighlight>
          <Text style={styles.similarstyle}>Silimar Movies</Text>
          {similar.map((result) => (
            <TouchableHighlight
              key={result.id}
              onPress={() => openMovie(result)}
            >
              <View style={styles.result}>
                <Image
                  source={{
                    uri: "https://image.tmdb.org/t/p/w500" + result.poster_path,
                  }}
                  style={{
                    width: "100%",
                    height: 300,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.heading}>{result.title}</Text>
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}
