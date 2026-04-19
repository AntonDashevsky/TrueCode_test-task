import { Flex, Spin } from 'antd';
import type { CSSProperties } from 'react';
import { memo } from 'react';

type InlineLoadingProps = {
  tip: string;
  minHeight?: number;
  style?: CSSProperties;
};

export const InlineLoading = memo(function InlineLoading({
  tip,
  minHeight = 200,
  style,
}: InlineLoadingProps) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ minHeight, padding: 24, ...style }}
    >
      <Spin size="large" tip={tip} />
    </Flex>
  );
});
