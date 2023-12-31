import { useQueryProdutcts } from "./service";
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  ActionIcon,
} from "@mantine/core";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import classes from "./table.module.css";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading";
import { Buttons } from "@/components/button";
import { useRouter } from "next/router";

const ProductsFeatures = () => {
  const router = useRouter();
  const { data, isFetching } = useQueryProdutcts(0);
  const products = data?.data.products;
  console.log(products, isFetching);
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(products);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSortedData(
      sortData(products, { sortBy, reversed: reverseSortDirection, search })
    );
  }, [products, reverseSortDirection, search, sortBy]);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(products, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(products, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const rows = sortedData?.map((row) => (
    <tr key={row.id}>
      <td>{row.title}</td>
      <td>{row.description}</td>
      <td>{row.category}</td>
      <td>{row.createdAt}</td>
      <td>{row.updatedAt}</td>
      <td>
        <Group spacing={4} position="center" noWrap>
          <ActionIcon color="blue" onClick={() => onHandleEditData(true, data)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            color="red"
            onClick={() => onHandleDeleteData(true, data.id)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ));

  const tambahPage = () => {
    router.push("/tambah");
  };

  return (
    <>
      <Buttons onClick={tambahPage}>Tambah Data</Buttons>
      <ScrollArea>
        <TextInput
          placeholder="Search by any field"
          mb="md"
          leftSection={
            <IconSearch
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          value={search}
          onChange={handleSearchChange}
        />
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
        >
          <tbody>
            <tr>
              <Th
                sorted={sortBy === "title"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("title")}
              >
                Title
              </Th>
              <Th
                sorted={sortBy === "description"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("description")}
              >
                Description
              </Th>
              <Th
                sorted={sortBy === "category"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("category")}
              >
                Category
              </Th>
              <Th
                sorted={sortBy === "createdAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createdAt")}
              >
                Created At
              </Th>
              <Th
                sorted={sortBy === "updatedAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("updatedAt")}
              >
                Updated At
              </Th>
              <Th>Aksi</Th>
            </tr>
          </tbody>
          <tbody>
            {rows?.length > 0 ? (
              rows
            ) : (
              <tr>
                <td
                  colSpan={!isFetching ? Object.keys(products[0]).length : ""}
                >
                  <Center>
                    <Loading />
                  </Center>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default ProductsFeatures;

function Th({ children, reversed, sorted, onSort }) {
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const query = search.toLowerCase().trim();
  return data?.filter((item) =>
    Object.keys(data[0]).some(
      (key) =>
        typeof item[key] === "string" && item[key].toLowerCase().includes(query)
    )
  );
}

function sortData(data, payload) {
  var sortBy = payload.sortBy;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    data?.slice().sort(function (a, b) {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}
