import { useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Button,
  Card,
  InfoModal,
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
  const [liabilitiesInfoVisible, setLiabilitiesInfoVisible] = useState(false);

  const genderOptions = [
    { value: 'male' as Gender, label: t('deceased.male') },
    { value: 'female' as Gender, label: t('deceased.female') },
  ];

  const currencyOptions = CURRENCIES.map((code) => ({
    value: code,
    label: t(`currency.${code}`),
  }));

  const currencyLabel = t(`currency.${data.currency}`);
  const fmt = (n: number) => `${currencyLabel} ${Math.round(n)}`;

  const net = netEstate(data); // assets − debts
  const maxWasiyaValue = Math.max(0, net / 3);
  const wasiyaAmount = data.deceased.hasWasiya ? data.deceased.wasiyaAmount : 0;
  const wasiyaExceeds = data.deceased.hasWasiya && wasiyaAmount > maxWasiyaValue;
  // A bequest above the legal third is void for the excess, so only deduct
  // up to one third when computing what reaches the heirs.
  const forDistribution = net - Math.min(wasiyaAmount, maxWasiyaValue);

  // An asset added via "+" must get a value before the user can continue.
  // (Description stays optional; gold's value is derived from grams × price.)
  const hasIncompleteAsset = data.assets.some((a) => a.value <= 0);

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

        {/* Liabilities — must come before Wasiya so the 1/3 cap is
            calculated on net estate (assets − debts), not gross assets. */}
        <Card>
          <View style={styles.row}>
            <Text variant="label">{t('liabilities.label')}</Text>
            <Pressable
              onPress={() => setLiabilitiesInfoVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={t('liabilities.infoLabel')}
              hitSlop={8}
            >
              <Text variant="label" style={{ color: colors.secondary }}>ⓘ</Text>
            </Pressable>
          </View>
          <TextField
            label={undefined}
            value={data.liabilities ? String(data.liabilities) : ''}
            onChangeText={(text) => setLiabilities(toNumber(text))}
            keyboardType="numeric"
            placeholder="0"
          />
        </Card>

        {/* Wasiya (bequest) — max is 1/3 of net estate after debts */}
        <Card>
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
                error={
                  wasiyaExceeds
                    ? t('deceased.wasiyaExceeds', { max: fmt(maxWasiyaValue) })
                    : undefined
                }
              />
              <Text variant="caption">
                {t('deceased.wasiyaMax', { max: fmt(maxWasiyaValue) })}
              </Text>
            </View>
          ) : null}
        </Card>

        {/* Net estate for distribution = assets − debts − (valid) bequest */}
        <Card>
          <Text variant="label">{t('netEstate.label')}</Text>
          <Text variant="title">{fmt(forDistribution)}</Text>
          {data.deceased.hasWasiya ? (
            <Text variant="caption">{t('netEstate.afterWasiya')}</Text>
          ) : null}
        </Card>

        {hasIncompleteAsset ? (
          <Text variant="caption">{t('assets.incompleteHint')}</Text>
        ) : null}

        <InfoModal
          visible={liabilitiesInfoVisible}
          onClose={() => setLiabilitiesInfoVisible(false)}
          title={t('liabilities.infoTitle')}
          items={[
            t('liabilities.infoItem1'),
            t('liabilities.infoItem2'),
            t('liabilities.infoItem3'),
          ]}
        />

        <Button
          label={t('actions.next')}
          onPress={() => navigation.navigate('FamilyDetails')}
          disabled={hasIncompleteAsset}
        />
      </ScrollView>
    </View>
  );
}

// Inline editor for a single asset, shown under its type row. Renders the
// kind-specific unit field(s) plus the value used for the estate total.
function AssetEditor({ asset }: { asset: Asset }) {
  const colors = useColors();
  const { t } = useTranslation('form');
  const { data, updateAsset, removeAsset } = useForm();
  const currencyLabel = t(`currency.${data.currency}`);

  return (
    <View style={[styles.editor, { borderTopColor: colors.divider }]}>
      {asset.kind === 'gold' ? (
        <>
          <TextField
            label={t('assets.gold.grams')}
            value={asset.grams ? String(asset.grams) : ''}
            onChangeText={(text) => {
              const grams = toNumber(text);
              // Keep the derived total value in sync: grams × price/gram.
              updateAsset(asset.id, {
                grams,
                value: grams * asset.pricePerGram,
              });
            }}
            keyboardType="numeric"
            placeholder="0"
            valid={asset.grams > 0}
          />
          <TextField
            label={`${t('assets.gold.pricePerGram')} (${currencyLabel})`}
            value={asset.pricePerGram ? String(asset.pricePerGram) : ''}
            onChangeText={(text) => {
              const pricePerGram = toNumber(text);
              updateAsset(asset.id, {
                pricePerGram,
                value: asset.grams * pricePerGram,
              });
            }}
            keyboardType="numeric"
            placeholder="0"
            valid={asset.pricePerGram > 0}
          />
          {/* Read-only computed total that feeds the estate sum. */}
          <Text variant="caption">
            {t('assets.totalValue', {
              currency: currencyLabel,
              total: Math.round(asset.grams * asset.pricePerGram),
            })}
          </Text>
        </>
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

      {/* Value field for every kind EXCEPT gold (gold's value is derived
          from grams × price/gram above). Required, so it shows ✓ / ✗. */}
      {asset.kind !== 'gold' ? (
        <TextField
          label={`${t('assets.value')} (${currencyLabel})`}
          value={asset.value ? String(asset.value) : ''}
          onChangeText={(text) => updateAsset(asset.id, { value: toNumber(text) })}
          keyboardType="numeric"
          placeholder="0"
          valid={asset.value > 0}
        />
      ) : null}

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
