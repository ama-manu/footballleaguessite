import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function DropdownMenu() {
	return (
		<Menu>
			<MenuButton>Dropdown</MenuButton>
			<MenuItems>
				<MenuItem>
					<div>Item 1</div>
				</MenuItem>
			</MenuItems>
		</Menu>
	);
}

export default DropdownMenu;
