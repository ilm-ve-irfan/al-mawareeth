import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Card, StepIndicator, Text } from '../../components';
import { spacing, useColors } from '../../theme';
import { useWidgetStyles } from '../../styles/widgets';
import { useForm } from '../../src/form/FormContext';
import {
  type Heir,
  type HeirRelation,
  netEstate,
  totalAssets,
} from '../../src/form/types';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

// Position of this screen in the overall flow (DeceasedInfo=1, Family=2).
const STEP_CURRENT = 3;
const STEP_TOTAL = 4;

// Group thousands with a comma (500000 -> "500,000"). Hermes (RN's engine)
// has no reliable Intl.NumberFormat, so format the integer part by hand.
const groupThousands = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// One summary line per heir relation: keeps the relation, the names of
// everyone with that relation, and (implicitly) how many there are.
type HeirGroup = { relation: HeirRelation; names: string[] };

// Collapse the flat heir list into groups, preserving first-seen order so
// the recap mirrors the order the user entered relatives in.
const groupHeirs = (heirs: Heir[]): HeirGroup[] => {
  const order: HeirRelation[] = [];
  const byRelation = new Map<HeirRelation, string[]>();
  for (const heir of heirs) {
    if (!byRelation.has(heir.relation)) {
      byRelation.set(heir.relation, []);
      order.push(heir.relation);
    }
    byRelation.get(heir.relation)!.push(heir.name);
  }
  return order.map((relation) => ({
    relation,
    names: byRelation.get(relation) ?? [],
  }));
};

export default function SummaryScreen(_props: Props) {
  const colors = useColors();
  const s = useWidgetStyles();
  const { t } = useTranslation('form');
  // Relation keys are dynamic data; widen the strongly-typed `t`.
  const tt = t as unknown as (key: string) => string;
  const { data } = useForm();

  const currencyLabel = t(`currency.${data.currency}`);
  const fmt = (n: number) => `${currencyLabel} ${groupThousands(n)}`;

  // Read-only figures only — NO farā'iḍ maths happens on this screen, it
  // just recaps what the user already entered on the previous steps.
  const estate = totalAssets(data.assets);
  const debts = data.liabilities;
  const net = netEstate(data); // estate − debts
  const maxWasiya = Math.max(0, net / 3);
  const enteredWasiya = data.deceased.hasWasiya ? data.deceased.wasiyaAmount : 0;
  // A bequest above the legal third is void for the excess, so only the
  // valid (capped) part leaves the distributable estate (matches DeceasedInfo).
  const wasiya = Math.min(enteredWasiya, maxWasiya);
  const wasiyaCapped = enteredWasiya > maxWasiya;
  const showWasiya = data.deceased.hasWasiya && wasiya > 0;
  const forDistribution = net - wasiya;

  const heirGroups = groupHeirs(data.heirs);
  const listSeparator = t('summary.listSeparator');

  // TODO(results): point this at the Results route (screen 05) once it is
  // added to RootStackParamList and registered in RootStack. Kept inert for
  // now so the button matches the design without navigating to a route that
  // does not exist yet.
  const onCalculate = () => {
    // navigation.navigate('Results');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <StepIndicator current={STEP_CURRENT} total={STEP_TOTAL} />

        {/* Deceased recap ---------------------------------------------- */}
        <Card>
          <Text variant="caption">{t('summary.deceasedLabel')}</Text>
          <Text variant="title">
            {data.deceased.name || t('summary.noName')}
          </Text>
          <Text variant="caption">{t(`deceased.${data.deceased.gender}`)}</Text>
        </Card>

        {/* Estate vs debts (side by side) ------------------------------ */}
        <View style={s.summary.statsRow}>
          <View style={[s.summary.statCard, s.summary.statEstate]}>
            <Text variant="caption">{t('summary.estate')}</Text>
            <Text variant="title">{fmt(estate)}</Text>
          </View>
          <View style={[s.summary.statCard, s.summary.statDebts]}>
            <Text variant="caption">{t('summary.debts')}</Text>
            <Text variant="title" style={s.summary.debtAmount}>
              {debts > 0 ? `- ${fmt(debts)}` : fmt(0)}
            </Text>
          </View>
        </View>

        {/* Wasiya (bequest) — only when present, shown as a deduction --- */}
        {showWasiya ? (
          <View style={styles.field}>
            <View style={s.summary.deductionRow}>
              <Text style={s.summary.deductionLabel}>{t('summary.wasiya')}</Text>
              <Text style={s.summary.deductionValue}>{`- ${fmt(wasiya)}`}</Text>
            </View>
            {wasiyaCapped ? (
              <Text style={s.summary.deductionNote}>
                {t('summary.wasiyaCapped', { max: fmt(maxWasiya) })}
              </Text>
            ) : null}
          </View>
        ) : null}

        {/* Net estate available for distribution ----------------------- */}
        <View style={styles.field}>
          <View style={s.summary.netBar}>
            <Text style={s.summary.netLabel}>{t('netEstate.label')}</Text>
            <Text style={s.summary.netValue}>{fmt(forDistribution)}</Text>
          </View>
          {data.deceased.hasWasiya ? (
            <Text style={s.summary.netNote}>{t('netEstate.afterWasiya')}</Text>
          ) : null}
        </View>

        {/* Heirs ------------------------------------------------------- */}
        <Card>
          <Text variant="caption">{t('summary.heirs')}</Text>
          {heirGroups.length === 0 ? (
            <Text style={s.summary.empty}>{t('summary.noHeirs')}</Text>
          ) : (
            heirGroups.map((group, index) => (
              <View
                key={group.relation}
                style={[
                  s.summary.heirRow,
                  index === 0 ? s.summary.heirRowFirst : null,
                ]}
              >
                <View style={s.summary.heirInfo}>
                  <Text variant="body">
                    {tt(`relations.${group.relation}`)}
                  </Text>
                  <Text variant="caption">
                    {group.names.join(listSeparator)}
                  </Text>
                </View>
                <View style={s.summary.badge}>
                  <Text style={s.summary.badgeLabel}>
                    {t('summary.times', { n: group.names.length })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        <Button label={t('summary.calculate')} onPress={onCalculate} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  // Groups a strip/bar with its caption underneath at a tight gap.
  field: { gap: spacing.xs },
});
