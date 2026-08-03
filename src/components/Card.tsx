import { Paper, Text, Button, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useColorMap } from '../theme/colorMap';
import type { FlashCard } from '../types';

const CardItem: React.FC<FlashCard> = ({ title, catchPhrase, link, author, timeAgo }) => {
  const { surfaceBg, surfaceText } = useColorMap();

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="lg"
      bg={surfaceBg}
      c={surfaceText}
      style={{
        flex: '0 0 40%',
        textAlign: 'center',
      }}
    >
      <Text size="xl" fw={600} c="teal.5" mb="sm">
        {title}
      </Text>

      {author && (
        <Text size="sm" fs="italic" mb={4}>
          {author}
        </Text>
      )}

      {timeAgo && (
        <Text size="sm" fs="italic" mb="sm">
          {timeAgo}
        </Text>
      )}

      <Text size="sm" c="gray.6" mb="md">
        {catchPhrase}
      </Text>

      {link && (
        <Box mt="md">
          <Button
            component={Link}
            to={link.to}
            variant="light"
            color="teal"
            radius="md"
          >
            {link.text}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CardItem;
