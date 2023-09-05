import {Review, useReviews} from "../../reviews/useReviews";
import {DataTable, DataTableSortStatus} from "mantine-datatable";
import {useEffect, useState} from "react";
import {sortBy} from "./utils";
import {Box, createStyles, Rating, TextInput} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {getPath, Paths} from "../../routes/paths";
import {IconSearch} from "@tabler/icons-react";
import {useDebouncedValue} from "@mantine/hooks";

const useStyles = createStyles((theme) => ({
    tableContainer: {
        padding: 50,
        [theme.fn.smallerThan('xs')]: {
            padding: 5,
        },
        background: theme.colorScheme === 'dark' ? theme.fn.gradient({
            from: 'black',
            to: '#00609F',
            deg: 20
        }) : theme.fn.gradient({from: '#00609F', to: 'white', deg: 20})
    },
    table: {
        background: theme.colorScheme === 'dark' ? '#1A1B1E' : '#fff',
        opacity: ".95"
    }
}))

const ClassesTable = () => {
    const navigate = useNavigate()
    const {reviews, isLoading} = useReviews()
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({columnAccessor: 'course', direction: 'asc'});
    const [records, setRecords] = useState(reviews);
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebouncedValue(query, 300);
    const {classes} = useStyles()

    useEffect(() => {
        setRecords(reviews);
    }, [reviews]);

    useEffect(() => {
        const data = sortBy(reviews, sortStatus.columnAccessor) as Review[];
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    }, [sortStatus]);

    const handleRowClick = (record: Review) => {
        const dynamicPath = getPath(Paths.courseDetail).replace(':id', record._id);
        navigate(dynamicPath);
    }

    useEffect(() => {
        setRecords(
            reviews.filter(({course}) => {
                return !(debouncedQuery !== '' && !course.toLowerCase().includes(debouncedQuery.trim().toLowerCase()));

            })
        );
    }, [debouncedQuery]);

    const ratingRender = (score: number) => {
        return (
            <>
                <Rating
                    value={score}
                    fractions={2}
                    readOnly
                    onChange={() => {
                        return false
                    }}
                />
            </>

        )
    }

    return (
        <Box className={classes.tableContainer} w={'100vw'} h={'calc(100vh - 60px)'}>
            <DataTable
                className={classes.table}
                withBorder
                highlightOnHover
                style={{
                    minWidth: '100%',
                    minHeight: '100%',
                    borderRadius: '4px'
                }}
                columns={[
                    {
                        accessor: 'index',
                        title: '#',
                        textAlignment: 'right',
                        width: 40,
                        render: (record) => records.indexOf(record) + 1,
                    },
                    {
                        accessor: 'course', sortable: true,
                        filter: (
                            <TextInput
                                label="Courses"
                                description="Search by course name"
                                placeholder="Search by course name"
                                icon={<IconSearch size={16}/>}
                                value={query}
                                onChange={(e) => setQuery(e.currentTarget.value)}
                            />
                        ),
                        filtering: query !== '',
                    },
                    {accessor: 'professor', sortable: true},
                    {accessor: 'courseId', sortable: true},
                    {
                        accessor: 'howInterestingRatingAverage',
                        title: 'How interesting',
                        sortable: true,
                        render: ({howInterestingRatingAverage}) => ratingRender(howInterestingRatingAverage)
                    },
                    {
                        accessor: 'howEasyRatingAverage',
                        title: 'How easy',
                        sortable: true,
                        render: ({howEasyRatingAverage}) => ratingRender(howEasyRatingAverage)
                    }
                ]}
                onRowClick={handleRowClick}
                records={records}
                fetching={isLoading}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                loaderSize="xs"
            />
        </Box>
    );
};

export {ClassesTable};
