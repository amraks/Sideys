import copy

BLANK = 0
SUDOKU_SIZE = 9 # obviously x 9 smarty

class SudokuSolver(object):

	def __init__(self, data_mat):
		self.mat = data_mat
		self.rstate = {}
		self._init_rstate()
		self.cstate = {}
		self._init_cstate()
		self.submatrix_state = {}
		self._init_submatrix_state()
		print '\nPROBLEM:\n'
		self.print_matrix(self.mat)

	def print_matrix(self, mat):
		for i in mat:
			print i
		print '\n'

	def _init_rstate(self):
		for i in range(len(self.mat)):
			self.rstate[i] = set(self.mat[i]) - set([BLANK])

	def _init_cstate(self):
		for c in range(len(self.mat)):
			self.cstate[c] = set()
			for r in range(len(self.mat)):
				self.cstate[c].add(self.mat[r][c])
			self.cstate[c] = self.cstate[c] - set([BLANK])

	def _init_submatrix_state(self):
		submatrices_locations = [(i, j) for i in range(0, 9, 3) for j in range(0, 9, 3)]
		for start_i, start_j in submatrices_locations:
			submatrix_indices = (start_i, start_j)
			self.submatrix_state[submatrix_indices] = {}
			for i in range(start_i, start_i + 3):
				for j in range(start_j, start_j + 3):
					if self.mat[i][j] != BLANK:
						if not self.submatrix_state[submatrix_indices]:
							self.submatrix_state[submatrix_indices] = set()
						self.submatrix_state[submatrix_indices].add(self.mat[i][j])

	def _check_if_element_exists_in_row(self, rstate, row, num):
		return num in rstate[row]

	def _check_if_element_exists_in_col(self, cstate, col, num):
		return num in cstate[col]

	def _get_submatrix_of_element(self, elementi, elementj):
		submatrix_to_check = (0, 0)
		if elementi in range(3):
			if elementj in range(3):
				submatrix_to_check = (0, 0)
			elif elementj in range(3, 6):
				submatrix_to_check = (0, 3)
			else:
				submatrix_to_check = (0, 6)
		elif elementi in range(3, 6):
			if elementj in range(3):
				submatrix_to_check = (3, 0)
			elif elementj in range(3, 6):
				submatrix_to_check = (3, 3)
			else:
				submatrix_to_check = (3, 6)
		elif elementi in range(6, 9):
			if elementj in range(3):
				submatrix_to_check = (6, 0)
			elif elementj in range(3, 6):
				submatrix_to_check = (6, 3)
			else:
				submatrix_to_check = (6, 6)
		return submatrix_to_check

	def _check_if_element_exists_in_sub_3_x_3_matrix(self, submatrix_state, elementi, elementj, element):
		submatrix_to_check = self._get_submatrix_of_element(elementi, elementj)
		return element in submatrix_state[submatrix_to_check]

	def _get_next_index(self, elementi, elementj):
		if elementj < len(self.mat[elementi]) - 1:
			elementj = elementj + 1
		else:
			elementi = elementi + 1
			elementj = 0
		return elementi, elementj

	def solve(self, cur_mat, crow, ccol, lrstate, lcstate, submatrix_state):
		if crow == len(self.mat):
			print 'SOLUTION:\n'
			self.print_matrix(cur_mat)
			return True
		elif cur_mat[crow][ccol] != BLANK:
			next_row, next_col = self._get_next_index(crow, ccol)
			if self.solve(cur_mat, next_row, next_col, lrstate, lcstate, submatrix_state):
				return True
		else:
			poss = []
			for i in range(SUDOKU_SIZE):
				if (not self._check_if_element_exists_in_col(lcstate, ccol, i + 1) \
					and not self._check_if_element_exists_in_row(lrstate, crow, i + 1) \
						and not self._check_if_element_exists_in_sub_3_x_3_matrix(submatrix_state, crow, ccol, i + 1)):
					poss.append(i + 1)
			next_row, next_col = self._get_next_index(crow, ccol)
			for p in poss:
				new_cur_mat = self._get_new_matrix(cur_mat, crow, ccol, p)
				new_rstate = self._get_new_cstate_or_rstate(crow, p, lrstate)
				new_cstate = self._get_new_cstate_or_rstate(ccol, p, lcstate)
				new_submatrix_state = self._get_new_submatrix_state(submatrix_state, crow, ccol, p)
				if self.solve(new_cur_mat, next_row, next_col, new_rstate, new_cstate, new_submatrix_state):
					return True
		return False

	def _get_new_submatrix_state(self, submatrix_state, crow, ccol, p):
		new_submatrix_state = copy.deepcopy(submatrix_state)
		submatrix = self._get_submatrix_of_element(crow, ccol)
		new_submatrix_state[submatrix].add(p)
		return new_submatrix_state

	def _get_new_matrix(self, cur_mat, crow, ccol, e):
		new_cur_mat = copy.deepcopy(cur_mat)
		new_cur_mat[crow][ccol] = e
		return new_cur_mat

	def _get_new_cstate_or_rstate(self, row_or_col, e, state):
		new_state = copy.deepcopy(state)
		new_state[row_or_col].add(e)
		return new_state

data_mat = [[5, 3, BLANK, BLANK, 7, BLANK, BLANK, BLANK, BLANK],
			[6, BLANK, BLANK, 1, 9, 5, BLANK, BLANK, BLANK],
			[BLANK, 9, 8, BLANK, BLANK, BLANK, BLANK, 6, BLANK],
			[8, BLANK, BLANK, BLANK, 6, BLANK, BLANK, BLANK, 3],
			[4, BLANK, BLANK, 8, BLANK, 3, BLANK, BLANK, 1],
			[7, BLANK, BLANK, BLANK, 2, BLANK, BLANK, BLANK, 6],
			[BLANK, 6, BLANK, BLANK, BLANK, BLANK, 2, 8, BLANK],
			[BLANK, BLANK, BLANK, 4, 1, 9, BLANK, BLANK, 5],
			[BLANK, BLANK, BLANK, BLANK, 8, BLANK, BLANK, 7, 9]]

s = SudokuSolver(data_mat)
s.solve(s.mat, 0, 0, s.rstate, s.cstate, s.submatrix_state)