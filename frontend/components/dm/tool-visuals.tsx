import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';
import { DM } from '@/constants/dm-theme';

interface ToolVisualProps {
  fillLevel?: number;
}

export function GlassVisual({ fillLevel = 0.45 }: ToolVisualProps) {
  return (
      <View style={glass.wrapper}>
        <View style={glass.rim} />
        <View style={glass.body}>
          <View style={[glass.liquidBottom, { height: `${fillLevel * 100}%` }]} />
          <View style={[glass.liquidMid, { height: `${fillLevel * 55}%` }]} />
        </View>
        <View style={glass.straw} />
      </View>
  );
}

export function ShakerVisual({ premium = false }: { premium?: boolean }) {
  const accent = premium ? DM.gold : DM.tealLight;
  const bodyBg = premium ? DM.goldDark : DM.card;

  return (
      <View style={shaker.wrapper}>
        <View style={[shaker.cap, { backgroundColor: accent, opacity: premium ? 1 : 0.7 }]} />
        <View style={[shaker.body, { borderColor: accent, backgroundColor: bodyBg }]}>
          <View style={[shaker.liquid, { backgroundColor: premium ? 'rgba(230,168,23,0.35)' : 'rgba(93,202,165,0.25)' }]} />
          {premium && <Text style={shaker.sparkle}>✨</Text>}
        </View>
        <View style={[shaker.base, { backgroundColor: accent, opacity: 0.5 }]} />
      </View>
  );
}

export function MortarVisual() {
  return (
      <View style={mortar.wrapper}>
        <View style={mortar.bowl}>
          <View style={mortar.herbs} />
          <View style={mortar.crushed} />
        </View>
        <View style={mortar.pestle} />
      </View>
  );
}

export function ActiveToolVisual({ tool, fillLevel }: { tool: string | null | undefined; fillLevel?: number }) {
  const toolLabel = tool ? tool.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "") : 'verre';

  switch (toolLabel) {
    case 'mortar':
      return <MortarVisual />;
    case 'shaker':
      return <ShakerVisual />;
    case 'golden-shaker':
      return <ShakerVisual premium />;
    case 'verre':
    default:
      return <GlassVisual fillLevel={fillLevel} />;
  }
}

const glass = StyleSheet.create({
  wrapper: { width: 90, height: 130, alignItems: 'center', justifyContent: 'center' },
  rim: {
    width: 40,
    height: 8,
    backgroundColor: DM.gold,
    opacity: 0.6,
    borderRadius: 2,
    marginBottom: -2,
  },
  body: {
    width: 44,
    height: 90,
    borderWidth: 2,
    borderColor: DM.tealLight,
    borderRadius: 4,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    opacity: 0.9,
  },
  liquidBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(212, 83, 126, 0.45)',
  },
  liquidMid: {
    position: 'absolute',
    bottom: '35%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(216, 90, 48, 0.3)',
  },
  straw: {
    position: 'absolute',
    right: 22,
    top: 8,
    width: 3,
    height: 50,
    backgroundColor: DM.gold,
    borderRadius: 2,
    transform: [{ rotate: '8deg' }],
    opacity: 0.7,
  },
});

const shaker = StyleSheet.create({
  wrapper: { width: 90, height: 130, alignItems: 'center', justifyContent: 'center' },
  cap: {
    width: 36,
    height: 14,
    borderRadius: 6,
    marginBottom: -2,
  },
  body: {
    width: 52,
    height: 88,
    borderWidth: 2,
    borderRadius: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  liquid: {
    width: '80%',
    height: '55%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 8,
  },
  base: {
    width: 48,
    height: 6,
    borderRadius: 3,
    marginTop: -2,
  },
  sparkle: { position: 'absolute', top: 28, fontSize: 14 },
});

const mortar = StyleSheet.create({
  wrapper: { width: 90, height: 130, alignItems: 'center', justifyContent: 'center' },
  bowl: {
    width: 64,
    height: 36,
    backgroundColor: DM.card,
    borderWidth: 2,
    borderColor: DM.muted,
    borderRadius: 32,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    marginTop: 40,
  },
  herbs: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 44,
    height: 14,
    backgroundColor: DM.teal,
    opacity: 0.5,
    borderRadius: 8,
  },
  crushed: {
    position: 'absolute',
    bottom: 6,
    left: 14,
    width: 36,
    height: 10,
    backgroundColor: DM.tealLight,
    opacity: 0.35,
    borderRadius: 6,
  },
  pestle: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 10,
    height: 56,
    backgroundColor: DM.gold,
    borderRadius: 5,
    transform: [{ rotate: '35deg' }],
    opacity: 0.85,
  },
});
