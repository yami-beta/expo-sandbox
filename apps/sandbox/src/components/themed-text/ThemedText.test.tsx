import { describe, expect, it } from "@jest/globals";
import { screen } from "@testing-library/react-native";
import { renderWithProviders } from "../../test-utils/render";
import { ThemedText } from "./ThemedText";

describe("ThemedText", () => {
  it("子テキストを描画する", async () => {
    await renderWithProviders(<ThemedText>こんにちは</ThemedText>);

    expect(screen.getByText("こんにちは")).toBeOnTheScreen();
  });

  it("weight prop を fontWeight スタイルへ反映する", async () => {
    await renderWithProviders(<ThemedText weight="bold">太字</ThemedText>);

    expect(screen.getByText("太字")).toHaveStyle({ fontWeight: "700" });
  });

  it("underline prop で下線スタイルを付与する", async () => {
    await renderWithProviders(<ThemedText underline>リンク風</ThemedText>);

    expect(screen.getByText("リンク風")).toHaveStyle({ textDecorationLine: "underline" });
  });
});
