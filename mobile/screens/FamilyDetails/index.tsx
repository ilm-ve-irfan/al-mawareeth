import { useReducer, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button, Card, StepIndicator, Text, TextField } from '../../components';
import { spacing, useColors } from '../../theme';
import { useForm } from '../../src/form/FormContext';
import type { Gender, Heir } from '../../src/form/types';
import {
  heirTree,
  type CollectNode,
  type HeirAnswer,
  type HeirCondition,
} from '../../src/form/heir-tree';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'FamilyDetails'>;

// Position of this screen in the overall flow (DeceasedInfo is step 1).
const STEP_CURRENT = 2;
const STEP_TOTAL = 4;

// --- Tree-walk engine (UI only; records answers, computes nothing) -------

type Snapshot = {
  currentId: string | null; // null once every branch has ended
  queue: string[]; // pending nodes, depth-first
  answers: Record<string, HeirAnswer>;
};

type WalkState = Snapshot & { gender: Gender; history: Snapshot[] };

// Context a guard needs to auto-resolve: gender (for branches), recorded
// answers, and the heirs collected so far (for count conditions).
type WalkCtx = {
  gender: Gender;
  answers: Record<string, HeirAnswer>;
  heirs: Heir[];
};

type WalkAction =
  | { type: 'answer'; answer: HeirAnswer; heirs: Heir[] } // boolean node
  | { type: 'next'; heirs: Heir[] } // collect node "continue"
  | { type: 'back' };

// Does a single guard condition hold in the given context?
function condHolds(cond: HeirCondition, ctx: WalkCtx): boolean {
  if ('relation' in cond) {
    const n = ctx.heirs.filter((h) => h.relation === cond.relation).length;
    return cond.count === 'none' ? n === 0 : n > 0;
  }
  const ans = ctx.answers[cond.node] ?? cond.whenMissing;
  return ans === cond.is;
}

// Pop the next renderable node, auto-resolving 'branch' (by gender) and
// 'guard' (by answers + collected heirs) nodes — neither is rendered.
function advance(
  startQueue: string[],
  ctx: WalkCtx,
): { currentId: string | null; queue: string[] } {
  let queue = [...startQueue];
  while (queue.length) {
    const [id, ...rest] = queue;
    const node = id ? heirTree.nodes[id] : undefined;
    if (node && node.kind === 'branch') {
      queue = [...(node.cases[ctx.gender] ?? []), ...rest];
      continue;
    }
    if (node && node.kind === 'guard') {
      const pass = node.all.every((cond) => condHolds(cond, ctx));
      queue = [...(pass ? node.next.then : node.next.else), ...rest];
      continue;
    }
    return { currentId: id ?? null, queue: rest };
  }
  return { currentId: null, queue: [] };
}

const initWalk = (arg: {
  mainIds: string[];
  gender: Gender;
  heirs: Heir[];
}): WalkState => {
  const answers: Record<string, HeirAnswer> = {};
  const { currentId, queue } = advance(arg.mainIds, {
    gender: arg.gender,
    answers,
    heirs: arg.heirs,
  });
  return { currentId, queue, answers, gender: arg.gender, history: [] };
};

function snapshot(state: WalkState): Snapshot {
  return {
    currentId: state.currentId,
    queue: state.queue,
    answers: state.answers,
  };
}

function walkReducer(state: WalkState, action: WalkAction): WalkState {
  switch (action.type) {
    case 'answer': {
      if (!state.currentId) return state;
      const node = heirTree.nodes[state.currentId];
      if (!node || node.kind !== 'boolean') return state;
      // Record the answer *before* advancing so a guard that depends on it
      // (possibly the very next node) sees the up-to-date value.
      const answers = { ...state.answers, [state.currentId]: action.answer };
      const merged = [...node.next[action.answer], ...state.queue];
      const { currentId, queue } = advance(merged, {
        gender: state.gender,
        answers,
        heirs: action.heirs,
      });
      return {
        ...state,
        currentId,
        queue,
        answers,
        history: [...state.history, snapshot(state)],
      };
    }
    case 'next': {
      if (!state.currentId) return state;
      const node = heirTree.nodes[state.currentId];
      if (!node || node.kind !== 'collect') return state;
      const merged = [...node.next, ...state.queue];
      const { currentId, queue } = advance(merged, {
        gender: state.gender,
        answers: state.answers,
        heirs: action.heirs,
      });
      return {
        ...state,
        currentId,
        queue,
        history: [...state.history, snapshot(state)],
      };
    }
    case 'back': {
      const prev = state.history[state.history.length - 1];
      if (!prev) return state;
      return { ...state, ...prev, history: state.history.slice(0, -1) };
    }
    default:
      return state;
  }
}

// --- Screen --------------------------------------------------------------

export default function FamilyDetailsScreen({ navigation }: Props) {
  const colors = useColors();
  const { t } = useTranslation('form');
  // Tree question keys are dynamic data; widen the strongly-typed `t`.
  const tt = t as unknown as (key: string) => string;
  const { data } = useForm();
  const [state, dispatch] = useReducer(
    walkReducer,
    {
      mainIds: heirTree.mainIds,
      gender: data.deceased.gender,
      heirs: data.heirs,
    },
    initWalk,
  );

  const node = state.currentId ? heirTree.nodes[state.currentId] : null;
  const answeredCount = Object.keys(state.answers).length;
  const finished = !node;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <StepIndicator current={STEP_CURRENT} total={STEP_TOTAL} />

        <Card>
          <Text variant="title">{t('family.title')}</Text>
          <Text variant="body">{t('family.subtitle')}</Text>
        </Card>

        {node && node.kind === 'boolean' ? (
          <Card>
            <Text variant="caption">
              {t('family.question', { n: answeredCount + 1 })}
            </Text>
            <Text variant="title">{tt(node.text)}</Text>
            <View style={styles.answers}>
              <View style={styles.col}>
                <Button
                  label={t('family.yes')}
                  onPress={() =>
                    dispatch({ type: 'answer', answer: 'yes', heirs: data.heirs })
                  }
                />
              </View>
              <View style={styles.col}>
                <Button
                  label={t('family.no')}
                  variant="ghost"
                  onPress={() =>
                    dispatch({ type: 'answer', answer: 'no', heirs: data.heirs })
                  }
                />
              </View>
            </View>
          </Card>
        ) : null}

        {node && node.kind === 'collect' ? (
          <CollectStep
            key={node.id}
            node={node}
            onDone={() => dispatch({ type: 'next', heirs: data.heirs })}
          />
        ) : null}

        {finished ? (
          <Card>
            <Text variant="title">{t('family.done')}</Text>
          </Card>
        ) : null}

        {answeredCount > 0 ? (
          <Card>
            {Object.entries(state.answers).map(([id, answer]) => {
              const n = heirTree.nodes[id];
              const label = n && 'text' in n ? tt(n.text) : '';
              return (
                <View key={id} style={styles.row}>
                  <Text variant="body">{label}</Text>
                  <Text variant="label">
                    {answer === 'yes' ? t('family.yes') : t('family.no')}
                  </Text>
                </View>
              );
            })}
          </Card>
        ) : null}

        <View style={styles.nav}>
          <Button
            label={t('actions.back')}
            variant="ghost"
            disabled={state.history.length === 0}
            onPress={() => dispatch({ type: 'back' })}
          />
          {finished ? (
            <Button
              label={t('actions.next')}
              onPress={() => navigation.navigate('Summary')}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

// Collect named heirs of one relation, then continue.
function CollectStep({
  node,
  onDone,
}: {
  node: CollectNode;
  onDone: () => void;
}) {
  const { t } = useTranslation('form');
  const tt = t as unknown as (key: string) => string;
  const { data, addHeir, removeHeir } = useForm();
  const [name, setName] = useState('');

  const items = data.heirs.filter((h) => h.relation === node.relation);
  const atMax = node.max != null && items.length >= node.max;
  const canAdd = name.trim().length > 0 && !atMax;

  const add = () => {
    if (!canAdd) return;
    addHeir({ relation: node.relation, name: name.trim() });
    setName('');
  };

  return (
    <Card>
      <Text variant="title">{tt(node.text)}</Text>
      {node.max != null ? (
        <Text variant="caption">{t('family.max', { count: node.max })}</Text>
      ) : null}

      <View style={styles.addRow}>
        <View style={styles.col}>
          <TextField
            value={name}
            onChangeText={setName}
            placeholder={t('family.namePlaceholder')}
            editable={!atMax}
          />
        </View>
        <Button
          label="+"
          onPress={add}
          disabled={!canAdd}
          accessibilityLabel={t('family.add')}
        />
      </View>

      {items.map((h) => (
        <View key={h.id} style={styles.row}>
          <Text variant="body">{h.name}</Text>
          <Button
            label={t('family.remove')}
            variant="ghost"
            onPress={() => removeHeir(h.id)}
          />
        </View>
      ))}

      <Button label={t('family.continue')} onPress={onDone} />
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg },
  answers: { flexDirection: 'row', gap: spacing.sm },
  addRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  col: { flex: 1 },
  nav: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
