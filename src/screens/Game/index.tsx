import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../../components/Background';
import { useRoute, useNavigation } from '@react-navigation/native'
import { GameParams } from '../../@types/navigation';
import { Entypo } from '@expo/vector-icons'

import logoImg from '../../assets/logo-nlw-esports.png';


import { styles } from './styles';
import { Text, FlatList, Image, TouchableOpacity, View } from 'react-native';
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useEffect, useState } from 'react';
import { DuoMatch } from '../../components/DuoMatch';



export function Game() {
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const route = useRoute()
  const game = route.params as GameParams
  const navigation = useNavigation()

  const handleGoBack = () => {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.56.1:3333/ads/${adsId}/discord`)
      .then(response => response.json())
      .then(data => setDiscordDuoSelected(data.discord))
  }

  useEffect(() => {
    fetch(`http://192.168.56.1:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => setDuos(data))
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
          >
            <Entypo
              name='chevron-thin-left'
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image
            style={styles.logo}
            source={logoImg}
          />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode='cover'
        />

        <Heading
          title={game.title}
          subtitle='Conecte-se e comece a jogar!'
        />

        <FlatList
          style={styles.containerList}
          data={duos}
          horizontal
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text
              style={styles.emptyListText}
            >Não há anúncios publicados ainda.</Text>
          )}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard onConnect={() => getDiscordUser(item.id)} data={item} />
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}