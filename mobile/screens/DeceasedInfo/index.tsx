import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Button,
  Card,
  SegmentedControl,
  Select,
  StepIndicator,
  Switch,
  Text,
  TextField,
} from '../../components';
import { spacing, useColors } from '../../theme';
import { useForm } from '../../src/form/FormContext';
import {
  type Asset,
  type AssetKind,
  type Currency,
  type Gender,
  netEstate,
} from '../../src/form/types';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'DeceasedInfo'>;

// Order of the asset rows shown in the "estate assets" section.
const ASSET_KINDS: AssetKind[] = [
  'cash',
  'gold',
  'realEstate',
  'vehicle',
  'other',
];

const CURRENCIES: Currency[] = ['SAR', 'USD', 'EUR'];

// Position of this screen in the input flow (adjust if the flow changes).
const STEP_CURRENT = 1;
const STEP_TOTAL = 4;

const toNumber = (text: string): number => {
  const n = Number(text.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

export default function DeceasedInfoScreen({ navigation }: Props) {
  const colors = useColors();
  const { t } = useTranslation('form');
  const { data, setDeceased, setCurrency, addAsset, setLiabilities } = useForm();

  const genderOptions = [
    { value: 'male' as Gender, label: t('deceased.male') },
    { value: 'female' as Gender, label: t('deceased.female') },
  ];

  const currencyOptions = CURRENCIES.map((code) => ({
    value: code,
    label: t(`currency.${code}`),
  }));

  const currencyLabel = t(`currency.${data.currency}`);
  const net = netEstate(data);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <StepIndicator current={STEP_CURRENT} total={STEP_TOTAL} />

        {/* Deceased ----------------------------------------------------- */}
        <Card>
          <Text variant="title">{t('deceased.title')}</Text>

          <TextField
            label={t('deceased.name')}
            value={data.deceased.name}
            onChangeText={(name) => setDeceased({ name })}
            placeholder={t('deceased.namePlaceholder')}
          />

          <View style={styles.field}>
            <Text variant="label">{t('deceased.gender')}</Text>
            <SegmentedControl
              options={genderOptions}
              value={data.deceased.gender}
              onChange={(gender) => setDeceased({ gender })}
            />
          </View>

          <View style={styles.row}>
            <Text variant="label">{t('deceased.hasWasiya')}</Text>
            <Switch
              value={data.deceased.hasWasiya}
              onValueChange={(hasWasiya) => setDeceased({ hasWasiya })}
            />
          </View>

          {data.deceased.hasWasiya ? (
            <View style={styles.field}>
              <TextField
                label={t('deceased.wasiyaAmount')}
                value={
                  data.deceased.wasiyaAmount
                    ? String(data.deceased.wasiyaAmount)
                    : ''
                }
                onChangeText={(text) =>
                  setDeceased({ wasiyaAmount: toNumber(text) })
                }
                keyboardType="numeric"
                placeholder="0"
              />
              <Text variant="caption">{t('deceased.wasiyaHint')}</Text>
            </View>
          ) : null}
        </Card>

        {/* Currency ----------------------------------------------------- */}
        <Card>
          <Text variant="label">{t('currency.label')}</Text>
          <Select
            options={currencyOptions}
            value={data.currency}
            onChange={setCurrency}
            accessibilityLabel={t('currency.label')}
          />
        </Card>

        {/* Assets ------------------------------------------------------- */}
        <Card>
          <Text variant="title">{t('assets.title')}</Text>
          {ASSET_KINDS.map((kind) => {
            const items = data.assets.filter((a) => a.kind === kind);
            return (
              <View key={kind} style={styles.field}>
                <View style={styles.row}>
                  <Text variant="body">{t(`assets.types.${kind}`)}</Text>
                  <Button
                    label="+"
                    onPress={() => addAsset(kind)}
                    accessibilityLabel={`${t('assets.add')} ${t(`assets.types.${kind}`)}`}
                  />
                </View>
                {items.map((asset) => (
                  <AssetEditor key={asset.id} asset={asset} />
                ))}
              </View>
            );
          })}
        </Card>

        {/* Net estate (single currency total → feeds the wasiya later) -- */}
        <Card>
          <Text variant="label">{t('netEstate.label')}</Text>
          <Text variant="title">{`${currencyLabel} ${net}`}</Text>
        </Card>

        {/* Liabilities -------------------------------------------------- */}
        <Card>
          <TextField
            label={t('liabilities.label')}
            value={data.liabilities ? String(data.liabilities) : ''}
            onChangeText={(text) => setLiabilities(toNumber(text))}
            keyboardType="numeric"
            placeholder="0"
          />
        </Card>

        <Button
          label={t('actions.next')}
          onPress={() => navigation.navigate('FamilyDetails')}
        />
      </ScrollView>
    </View>
  );
}

// Inline editor for a single asset, shown under its type row. Renders the
// kind-specific unit field(s) plus the value field used for the estate total.
function AssetEditor({ asset }: { asset: Asset }) {
  const colors = useColors();
  const { t } = useTranslation('form');
  const { data, updateAsset, removeAsset } = useForm();
  const currencyLabel = t(`currency.${data.currency}`);

  return (
    <View style={[styles.editor, { borderTopColor: colors.divider }]}>
      {asset.kind === 'gold' ? (
        <TextField
          label={t('assets.gold.grams')}
          value={asset.grams ? String(asset.grams) : ''}
          onChangeText={(text) => updateAsset(asset.id, { grams: toNumber(text) })}
          keyboardType="numeric"
          placeholder="0"
        />
      ) : null}

      {asset.kind === 'realEstate' ? (
        <>
          <TextField
            label={t('assets.realEstate.description')}
            value={asset.description}
            onChangeText={(description) => updateAsset(asset.id, { description })}
          />
          <TextField
            label={t('assets.realEstate.shares')}
            value={String(asset.shares)}
            onChangeText={(text) => updateAsset(asset.id, { shares: toNumber(text) })}
            keyboardType="numeric"
          />
        </>
      ) : null}

      {asset.kind === 'vehicle' || asset.kind === 'other' ? (
        <TextField
          label={t('assets.description')}
          value={asset.description ?? ''}
          onChangeText={(description) => updateAsset(asset.id, { description })}
        />
      ) : null}

      <TextField
        label={`${t('assets.value')} (${currencyLabel})`}
        value={asset.value ? String(asset.value) : ''}
        onChangeText={(text) => updateAsset(asset.id, { value: toNumber(text) })}
        keyboardType="numeric"
        placeholder="0"
      />

      <Button
        label={t('assets.remove')}
        variant="ghost"
        onPress={() => removeAsset(asset.id)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  field: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  editor: {
    gap: spacing.sm,
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
});
