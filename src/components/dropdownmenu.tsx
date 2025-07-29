import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

type DropdownType = "season" | "matchday";

interface DropdownMenuProps {
	type: DropdownType;
	defaultVal: number;
	data: number[];
	setfunction?: (value: number) => void; // Optional function to handle selection
}

function DropdownMenu({ type, defaultVal, data, setfunction }: DropdownMenuProps) {
	return (
		<Menu>
			<MenuButton>{type}</MenuButton>
			<MenuItems>
				{data.map((item) => (
					<MenuItem key={item}>
						<button onClick={() => setfunction && (type === "matchday" ? setfunction(item - 1) : setfunction(item))}>{item}</button>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
}

export default DropdownMenu;
