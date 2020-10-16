import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Linking
} from "react-native";

import api from './services/api'

const Repository = ({ id, title, url, techs = [], likes, handleLikeRepository }) => {
  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{title}</Text>

      <Text onPress={() => Linking.openURL(url)} style={styles.link}>URL: {url}</Text>

      <View style={styles.techsContainer}>
        {
          techs.map(tech => (
            <Text key={tech} style={styles.tech}>
              {tech}
            </Text>
          ))
        }
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${id}`}
        >
          {likes} curtidas
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={(id) => handleLikeRepository(id)}
        // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
        testID={`like-button-${id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  )
}


export default function App() {
  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`)

    const likedRepoIndex = repositories.findIndex(repo => repo.id === response.data.id)

    const newList = [...repositories]
    newList[likedRepoIndex] = response.data

    setRepositories(newList)
  }

  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('/repositories')
      .then((response) => setRepositories(response.data))
      .catch((error) => console.warn(error))
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => {
            return (
              <Repository
                id={repo.id}
                title={repo.title}
                url={repo.url}
                techs={repo.techs}
                likes={repo.likes}
                handleLikeRepository={() => handleLikeRepository(repo.id)}
              />
            )
          }}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  link: {
    fontWeight: 'bold',
    color: '#00f',
    textDecorationLine: 'underline'
  }
});
