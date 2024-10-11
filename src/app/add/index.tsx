import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "./styles";
import { colors } from "@/styles/colors";
import { Categories } from "@/components/categories";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { linkStorage } from "@/storage/link-storage";

export default function Add() {
  // Estado para armazenar o nome
  const [name, setName] = useState("");

  // Estado para armazenar a URL
  const [url, setUrl] = useState("");

  // Estado para armazenar a categoria
  const [category, setCategory] = useState("");

  // Função para adicionar um novo link
  async function handleAdd() {
    try {
      // Verifica se a categoria foi selecionada
      if (!category) {
        return Alert.alert("Categoria", "Selecione uma categoria");
      }

      // Verifica se o nome foi informado
      if (!name.trim()) {
        return Alert.alert("Nome", "Informe o nome");
      }

      // Verifica se a URL foi informada
      if (!url.trim()) {
        return Alert.alert("URL", "Informe a URL");
      }

      // Salva o novo link no armazenamento
      await linkStorage.save({
        id: new Date().getTime().toString(),
        category,
        name,
        url,
      });

      // Exibe uma mensagem de sucesso e volta para a tela anterior
      Alert.alert("Sucesso", "Link adicionado com sucesso", [
        { text: "OK", onPress: () => router.back() },
      ]);
      console.log({ category, name, url });
    } catch (error) {
      // Exibe uma mensagem de erro caso não seja possível adicionar o link
      Alert.alert("Erro", "Não foi possível adicionar o link");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      {/* Cabecalho com o nome */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={32} color={colors.gray[200]} />
        </TouchableOpacity>

        <Text style={styles.title}>Novo</Text>
      </View>

      {/* Componente para selecionar um tipo de categoria */}
      <Text style={styles.label}>Selecione uma categoria</Text>
      <Categories selected={category} onChange={setCategory} />

      {/* Campo para adicionar nome e url e criar um novo link */}
      <View style={styles.form}>
        <Input placeholder="Nome" onChangeText={setName} autoCorrect={false} />
        <Input
          placeholder="URL"
          onChangeText={setUrl}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button title="Adicionar" onPress={handleAdd} />
      </View>
    </View>
  );
}
