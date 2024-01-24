import {
  Empty_InnerG,
  Empty_LeftG,
  Empty_RightG,
  Full_InnerG,
  Full_LeftG,
  Full_RightG,
} from './emojis';

export function createBar(currentValue: number, maxValue: number) {
  const barLength = 14;
  const unitValue = maxValue / barLength;

  // 埋まっているセクションと埋まっていないセクションを計算
  const filledSections = Math.floor(currentValue / unitValue);
  const emptySections = Math.max(barLength - filledSections, 0);

  // 左端、中央、右端のマーカー
  const leftMarker = currentValue >= unitValue ? Full_LeftG : Empty_LeftG;
  const middleMarker = Full_InnerG;
  const rightMarker = filledSections === barLength ? Full_RightG : Empty_RightG;

  // プログレスバーを生成
  return `${leftMarker}${middleMarker.repeat(
    filledSections
  )}${Empty_InnerG.repeat(emptySections)}${rightMarker}`;
}
