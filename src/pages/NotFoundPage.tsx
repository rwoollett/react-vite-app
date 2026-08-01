import { Container, Center, Stack, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../resources/routes-constants';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const redirectToHomePage = () => {
    navigate(ROUTES.HOMEPAGE_ROUTE);
  };

  return (
    <Center style={{ height: '100%' }}>
      <Container>
        <Stack align="center" gap="md">
          <Title order={1} size="4rem">
            Oops 404!
          </Title>

          <Text
            size="lg"
            style={{ cursor: 'pointer' }}
            onClick={redirectToHomePage}
          >
            Homepage
          </Text>
        </Stack>
      </Container>
    </Center>
  );
};

export default NotFoundPage;
