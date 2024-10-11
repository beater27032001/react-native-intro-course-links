import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Alert,
  Linking,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { Categories } from "@/components/categories";
import { Link } from "@/components/link";
import { Option } from "@/components/option";
import { useState, useCallback } from "react";
import { categories } from "@/utils/categories";
import { LinkStorage, linkStorage } from "@/storage/link-storage";

export default function Index() {
  // Estado para controlar a visibilidade do modal
  const [showModal, setShowModal] = useState(false);
  
  // Estado para armazenar o link selecionado
  const [link, setLink] = useState<LinkStorage>({} as LinkStorage);
  
  // Estado para armazenar a lista de links filtrados pela categoria
  const [links, setLinks] = useState<LinkStorage[]>([]);
  
  // Estado para armazenar a categoria selecionada
  const [category, setCategory] = useState(categories[0].name);

  // Função para buscar os links do armazenamento e filtrar pela categoria selecionada
  async function getLinks() {
    try {
      const response = await linkStorage.get();

      const filtered = response.filter((link) => link.category === category);

      setLinks(filtered);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os links");
    }
  }

  // Função para exibir os detalhes do link selecionado no modal
  function handleDetails(selected: LinkStorage) {
    setShowModal(true);
    setLink(selected);
  }

  // Função para remover o link selecionado do armazenamento
  async function linkRemove() {
    try {
      await linkStorage.remove(link.id);
      getLinks();
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível remover o link");
    }
  }

  // Função para confirmar a remoção do link selecionado
  function handleRemove() {
    Alert.alert("Remover", "Tem certeza que deseja remover o link?", [
      { style: "cancel", text: "Não" },
      {
        text: "Sim",
        onPress: linkRemove,
      },
    ]);
  }

  // Função para abrir o link selecionado no navegador
  async function handleOpen(){
    try {
      await Linking.openURL(link.url);
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o link");
    }
  }

  // Efeito para buscar os links sempre que a categoria selecionada mudar
  useFocusEffect(
    useCallback(() => {
      getLinks();
    }, [category])
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com logo e botão para adicionar novo link */}
      <View style={styles.header}>
      <Image source={require("@/assets/logo.png")} style={styles.logo} />

      <TouchableOpacity onPress={() => router.navigate("/add")}>
        <MaterialIcons name="add" size={32} color={colors.green[300]} />
      </TouchableOpacity>
      </View>

      {/* Componente de categorias para filtrar os links */}
      <Categories selected={category} onChange={setCategory} />

      {/* Lista de links filtrados pela categoria */}
      <FlatList
      data={links}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link
        name={item.name}
        url={item.url}
        onDetails={() => handleDetails(item)}
        />
      )}
      style={styles.links}
      contentContainerStyle={styles.linksContent}
      showsVerticalScrollIndicator={false}
      />

      {/* Modal para exibir detalhes do link selecionado */}
      <Modal transparent visible={showModal} animationType="slide">
      <View style={styles.modal}>
        <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalCategory}>{link.category}</Text>
          <TouchableOpacity onPress={() => setShowModal(false)}>
          <MaterialIcons
            name="close"
            size={20}
            color={colors.gray[400]}
          />
          </TouchableOpacity>
        </View>

        <Text style={styles.modalLinkName}>{link.name}</Text>
        <Text style={styles.modalUrl}>{link.url}</Text>

        <View style={styles.modalFooter}>
          {/* Opção para excluir o link */}
          <Option
          name="Excluir"
          icon="delete"
          variant="secondary"
          onPress={handleRemove}
          />
          {/* Opção para abrir o link no navegador */}
          <Option name="Abrir" icon="language" onPress={handleOpen} />
        </View>
        </View>
      </View>
      </Modal>
    </View>
  );
}
