# JSX の条件分岐

## 方針

DRY（重複排除）を優先するあまり、1つの状態の挙動を理解するために複数の条件分岐を頭の中で合成しなければならない構造になっていないか注意する。条件が複数箇所に散らばるほど、人・コーディングエージェントどちらにとっても「この状態のとき何が表示されるか」を把握するための読解コストが増える。

これは「常にこう書け」という特定の書き方の強制ではなく、DRY とのトレードオフとして意識してほしい観点。状態の数が少なく重複する部分も小さいうちは重複が実害を持たないことも多いが、状態が増えたり分岐が入れ子になってきたら、多少の重複を許容してでも各状態の挙動を1箇所にまとめる方を優先する。

## テクニックの例: ガード節 + 絞り込んだ型を持つ switch

3状態以上の相互排他的な分岐であれば、独立した `&&` 条件を並べる代わりに、特殊ケースをガード節で early return し、残りは絞り込んだ型（`Exclude<T, "...">` 等）を持つ switch 文のサブコンポーネントに切り出す、という手段が有効なことがある。

- switch の各 case は自己完結していて、他の条件と合成せずに読める
- switch は構造的に排他的なので、複数条件が同時に成立しないことを自分で確認する必要がない
- TypeScript の網羅性チェックにより、状態の網羅漏れがコンパイルエラーとして検出できる

### Before: 独立した `&&` 条件が散らばっている

```tsx
return (
  <>
    {status === "done" && <Redirect href="/redirect/complete" />}
    {status !== "done" && (
      <ScreenScrollView>
        <ThemedText type="body">
          <Trans>...</Trans>
        </ThemedText>
        {status === "pending" && <View style={styles.pendingRow}>...</View>}
        {status === "idle" && <View style={styles.buttonRow}>...</View>}
      </ScreenScrollView>
    )}
  </>
);
```

`status === "pending"` の時に何が表示されるかを知るには4つの条件をすべて評価し、`pending` と `idle` が同時に true にならないことを自分で確認する必要がある。

### After: ガード節 + 絞り込んだ型を持つ switch

```tsx
if (status === "done") {
  return <Redirect href="/redirect/complete" />;
}

return (
  <ScreenScrollView>
    <ThemedText type="body">
      <Trans>...</Trans>
    </ThemedText>
    <ActionArea status={status} onSubmit={handleSubmit} />
  </ScreenScrollView>
);

interface ActionAreaProps {
  status: Exclude<SubmitStatus, "done">;
  onSubmit: () => void;
}

function ActionArea({ status, onSubmit }: ActionAreaProps): ReactElement {
  switch (status) {
    case "idle":
      return <View style={styles.buttonRow}>...</View>;
    case "pending":
      return <View style={styles.pendingRow}>...</View>;
  }
}
```

`case "pending":` を読めばそのケースの全体が分かる。`ActionArea` が受け取れる `status` の型が `Exclude<SubmitStatus, "done">` なので、`done` を渡すことはコンパイル時に防がれる。

## 実例

[`apps/sandbox/src/features/redirect/RedirectDemoScreen.tsx`](../apps/sandbox/src/features/redirect/RedirectDemoScreen.tsx)
