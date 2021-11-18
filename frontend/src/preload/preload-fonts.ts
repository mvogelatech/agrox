import * as Font from 'expo-font';
import { FontAwesome, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import pMap from 'p-map';

export async function preloadFonts(): Promise<void> {
	const fonts = [FontAwesome, MaterialIcons, SimpleLineIcons, MaterialCommunityIcons];

	console.log('Started preloading fonts...');

	await pMap(fonts, async (font) => Font.loadAsync(font.font));

	console.log('Done preloading fonts!');
}
