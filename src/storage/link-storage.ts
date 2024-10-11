import AsyncStorage from "@react-native-async-storage/async-storage";

// Chave usada para armazenar links no AsyncStorage
const LINK_STORAGE_KEY = "links-storage";

// Definição de tipo para um objeto de link
export type LinkStorage = {
  id: string;
  name: string;
  url: string;
  category: string;
};

// Função para obter todos os links armazenados
async function get(): Promise<LinkStorage[]> {
  const storage = await AsyncStorage.getItem(LINK_STORAGE_KEY); // Recupera os links armazenados
  const response = storage ? JSON.parse(storage) : []; // Analisa os links armazenados ou retorna um array vazio

  return response;
}

// Função para salvar um novo link
async function save(newLink: LinkStorage) {
  try {
    const storage = await get(); // Obtém os links armazenados atualmente
    const update = [...storage, newLink]; // Adiciona o novo link à lista

    await AsyncStorage.setItem(LINK_STORAGE_KEY, JSON.stringify(update)); // Armazena a lista atualizada
  } catch (error) {
    throw error; // Lança um erro em caso de falha
  }
}

// Função para remover um link pelo ID
async function remove(id: string) {
  try {
    const storage = await get(); // Obtém os links armazenados atualmente
    const updated = storage.filter((link) => link.id !== id); // Filtra os links para remover o link com o ID especificado

    await AsyncStorage.setItem(LINK_STORAGE_KEY, JSON.stringify(updated)); // Armazena a lista atualizada
  } catch (error) {
    throw error; // Lança um erro em caso de falha
  }
}

// Exporta as funções de armazenamento de links
export const linkStorage = {
  get,
  save,
  remove
};
