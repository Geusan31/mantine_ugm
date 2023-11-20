import { addProduct } from "@/common/query/query";
import { TextInput, SimpleGrid, Group, Title, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

const handleValidateForm = (data, field) => {
  return data === "" || data === null ? `${field} must filled` : null;
};

export function TambahData() {
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      category: '',
    },
    validate: {
      title: (value) => handleValidateForm(value, 'Title'),
      description: (value) => handleValidateForm(value, 'Description'),
      category: (value) => handleValidateForm(value, 'Category'),
    },
  });

  const { mutate, isLoading } = useMutation(addProduct, {
    onSuccess: (response) => {
      if(response.status === 201) {
        notifications.show({
          title: 'Success',
          message: 'Success created data!',
        })
      }
    },
    onError: () => {
      notifications.show({
        title: 'Failed',
        message: 'Failed add data!',
        color: 'red'
      })
    }
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Title
        order={2}
        size="h1"
        style={{
          fontFamily: "Greycliff CF, var(--mantine-font-family)",
          marginTop: "20px",
        }}
        fw={900}
        ta="left"
      >
        Tambah Data
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
        <TextInput
          label="title"
          placeholder="Your title"
          name="title"
          variant="filled"
          {...form.getInputProps("title")}
        />
        <TextInput
          label="description"
          placeholder="Your description"
          name="description"
          variant="filled"
          {...form.getInputProps("description")}
        />
      </SimpleGrid>

      <TextInput
        label="category"
        placeholder="category"
        mt="md"
        name="category"
        variant="filled"
        {...form.getInputProps("category")}
      />
      <Group justify="center" mt="xl">
        <Button type="submit" size="md">
          Send message
        </Button>
      </Group>
    </form>
  );
}
