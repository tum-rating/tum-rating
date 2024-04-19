import {
    ActionIcon,
    CheckIcon,
    Combobox,
    Group,
    MultiSelectProps,
    Pill,
    PillsInput,
    ScrollArea,
    useCombobox
} from "@mantine/core";
import {IconFilterCancel, IconSearch, IconX} from "@tabler/icons-react";
import {useState} from "react";


interface ColumnFilterComboboxProps extends MultiSelectProps {
    data: string[]
}

const ColumnFilterCombobox = (props: ColumnFilterComboboxProps) => {
    const {data, value, placeholder, onChange, label, description} = props;
    const combobox = useCombobox();
    const [search, setSearch] = useState('');

    const handleValueSelect = (val: string) => onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])
    const handleValueRemove = (val: string) => onChange(value.filter((v) => v !== val));

    const values = value.map((item) => (
        <Pill maw={100} key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {String(item)}
        </Pill>
    ));

    const options = data.filter((item) => String(item).toLowerCase().includes(search.trim().toLowerCase()))
        .map((item, index) => {
            return (
                <Combobox.Option value={item} key={item + index} active={value.includes(item)}>
                    <Group gap="sm">
                        {value.includes(item) ? <CheckIcon size={12}/> : null}
                        <Group gap={7}>
                            <span>{String(item)}</span>
                        </Group>
                    </Group>
                </Combobox.Option>
            );
        });


    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
            <PillsInput
                label={label}
                description={description}
                leftSection={<IconSearch size={16}/>}
                pointer
                maw={250}
                rightSection={search.length ? <ActionIcon variant="white" onClick={() => {
                    setSearch('');
                }}><IconX size={16}/></ActionIcon> : null}
            >
                <Combobox.EventsTarget>
                    <PillsInput.Field
                        placeholder={placeholder || 'Search...'}
                        value={search}
                        onChange={(event) => {
                            combobox.updateSelectedOptionIndex();
                            setSearch(event.currentTarget.value);
                        }}
                    />
                </Combobox.EventsTarget>
            </PillsInput>
            <Pill.Group size="xs" maw={250} my="xs">
                <ScrollArea.Autosize mah={50} type="scroll">
                    {values.length > 0 && (
                        values
                    )}
                </ScrollArea.Autosize>
            </Pill.Group>

            <div>
                <Combobox.Options>
                    <Combobox.Group label={label}>
                        <ScrollArea.Autosize mah={200} type="scroll">
                            {options.length > 0 ? options : <Combobox.Empty>Nothing found....</Combobox.Empty>}
                        </ScrollArea.Autosize>
                    </Combobox.Group>
                </Combobox.Options>
            </div>
            {
                values.length > 0 && (
                    <ActionIcon color="red" variant="subtle" pos="absolute" right="17px" top="15px" onClick={()=>{
                        onChange([])
                    }}>
                        <IconFilterCancel size={18}/>
                    </ActionIcon>
                )
            }
        </Combobox>
    )
}

export {ColumnFilterCombobox}