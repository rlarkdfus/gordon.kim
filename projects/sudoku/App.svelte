<script>
	const CHANCE = 0.35;
	const TEMPLATE = [
		[5, 4, 8, 3, 2, 7, 1, 9, 6],
		[7, 2, 1, 9, 6, 8, 3, 5, 4],
		[6, 3, 9, 5, 1, 4, 7, 2, 8],
		[4, 7, 5, 8, 9, 6, 2, 1, 3],
		[1, 6, 3, 7, 4, 2, 5, 8, 9],
		[8, 9, 2, 1, 3, 5, 6, 4, 7],
		[9, 8, 7, 2, 5, 3, 4, 6, 1],
		[3, 5, 6, 4, 8, 1, 9, 7, 2],
		[2, 1, 4, 6, 7, 9, 8, 3, 5],
	];
	let selected_row = undefined;
	let selected_col = undefined;
	let values = shuffle();

	function handle_keypress(event) {
		if (!values[selected_row][selected_col].original) {
			if (Number(event.key) > 0 && Number(event.key) < 10) {
				values[selected_row][selected_col].value = event.key;
			}

			if (event.code == "Backspace") {
				values[selected_row][selected_col].value = undefined;
			}
		}

		if (event.code == "ArrowUp" || event.code == "KeyW") {
			if (selected_row > 0) select(selected_row - 1, selected_col);
		}
		if (event.code == "ArrowDown" || event.code == "KeyS") {
			if (selected_row < 8) select(selected_row + 1, selected_col);
		}
		if (event.code == "ArrowLeft" || event.code == "KeyA") {
			if (selected_col > 0) select(selected_row, selected_col - 1);
		}
		if (event.code == "ArrowRight" || event.code == "KeyD") {
			if (selected_col < 8) select(selected_row, selected_col + 1);
		}
	}

	function select(row, col) {
		selected_row = row;
		selected_col = col;
	}

	function is_samebox(x, y, i, j) {
		return (
			Math.floor(x / 3) == Math.floor(i / 3) &&
			Math.floor(y / 3) == Math.floor(j / 3)
		);
	}

	function is_samenumber(x, y, i, j, values) {
		return values[x][y].value && i !== undefined && j !== undefined && values[x][y].value == values[i][j].value
	}

	function iterbox(row, col, callback) {
		const box_row = Math.floor(row / 3);
		const box_col = Math.floor(col / 3);

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				callback(box_row * 3 + i, box_col * 3 + j);
			}
		}
	}

	function validate(row, col, values) {
		let valid = true;

		const check = (i, j, k, l) => {
			if (
				(i != k || j != l) &&
				values[i][j].value != undefined &&
				values[i][j].value == values[k][l].value
			) {
				valid = false;
			}
		};

		for (let i = 0; i < 9; i++) {
			check(row, col, row, i);
			check(row, col, i, col);
		}

		iterbox(row, col, (i, j) => check(row, col, i, j))
		return valid;
	}

	function generate_shuffle_pair() {
		let i = Math.floor(Math.random() * 9);
		let block_index = Math.floor(i / 3);
		let j = Math.floor(Math.random() * 2);
		if (j >= i - block_index * 3) j++;
		return [i, j + block_index * 3];
	}

	function shuffle() {
		const sudoku_box = [];

		const digit_map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

		for (let i = 0; i < 100; i++) {
			const a = Math.floor(Math.random() * 9 + 1);
			const b = Math.floor(Math.random() * 9 + 1);
			[digit_map[a], digit_map[b]] = [digit_map[b], digit_map[a]]
		}

		for (let i = 0; i < 100; i++) {
			const p1 = generate_shuffle_pair();
			const p2 = generate_shuffle_pair();
			shuffle_row(p1[0], p1[1]);
			shuffle_col(p2[0], p2[1]);
		}

		for (let i = 0; i < 9; i++) {
			sudoku_box[i] = [];
			for (let j = 0; j < 9; j++) {
				const display = Math.random() < CHANCE
				sudoku_box[i][j] = {
					value: display ? digit_map[TEMPLATE[i][j]] : undefined,
					original: display,
				};
			}
		}
		
		return sudoku_box;
	}

	function shuffle_row(i, j) {
		[TEMPLATE[i], TEMPLATE[j]] = [TEMPLATE[j], TEMPLATE[i]];
	}

	function shuffle_col(i, j) {
		for (let it = 0; it < 9; it++)
			[TEMPLATE[it][i], TEMPLATE[it][j]] = [
				TEMPLATE[it][j],
				TEMPLATE[it][i],
			];
	}
	$: {

	}
</script>

<div id="sudoku" on:keydown={handle_keypress}>
	{#each values as row, i}
		<div class="row">
			{#each row as cell, j}
				<button
					class="cell"
					class:is-original={cell.original}
					class:is-samerow={i == selected_row}
					class:is-samecol={j == selected_col}
					class:is-invalid={!validate(i, j, values)}
					class:is-samenumber={is_samenumber(i, j, selected_row, selected_col, values)}
					class:is-samebox={is_samebox(i, j, selected_row, selected_col)}
					on:click={() => select(i, j)}
				>
					{cell.value !== undefined ? cell.value : ""}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	#sudoku {
		margin: auto;
		width: fit-content;
	}
	.row {
		display: flex;
	}

	.row:first-child .cell {
		border-top: 3px solid #000;
	}

	.row:nth-child(3n) .cell {
		border-bottom: 3px solid #000;
	}

	.cell {
		font-weight: 200;
		color: black;
		width: 80px;
		height: 80px;
		text-align: center;
		font-size: 50px;
		border-radius: 0px;
		margin: 0px;
		display: block;
		background-color: #f9f9fb;
		border: 0;
		border-right: 1px solid #000;
		border-bottom: 1px solid #000;
		font-family: 'Open Sans', sans-serif;
		padding: 0;
	}

	.cell:first-child {
		border-left: 3px solid #000;
	}

	.cell:nth-child(3n) {
		border-right: 3px solid #000;
	}

	.cell:focus {
		outline: none;
	}

	.cell.is-samerow,
	.cell.is-samecol,
	.cell.is-samebox {
		background-color: #D0E4F4;
	}

	.cell.is-samerow.is-samecol {
		background-color: #6AA9DC;
	}

	.cell.is-original {
		font-weight: 600;
		color: black;
	}

	.cell.is-invalid {
		color: #B80C09;
	}

	.cell.is-invalid.is-original {
		color: black;
		background-color: #F97977;
	}

	.cell.is-samerow.is-samecol.is-invalid {
		background-color: #F86562;
	}

	.cell.is-samenumber {
		background-color: #9CC6E8;
	}

	.cell.is-samenumber.is-invalid {
		background-color: #F97977;
	}
</style>
