package tictactoe;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class TicTacToe {

	int[] board; // 0 means empty, 1 means player1 (X), 2 means player2 (0)
	int boardDimension;
	List<Integer> availablePositions; // used for computing random move
	final static Scanner sc = new Scanner(System.in);

	public TicTacToe(int boardDimension) {
		this.boardDimension = boardDimension;
		this.board = new int[boardDimension * boardDimension];
		this.availablePositions = new ArrayList<Integer>();
		initBoard();
		initAvailablePositions();
		printBoard();
		startGame();
	}

	public void initAvailablePositions() {
		for (int i = 0; i < boardDimension * boardDimension; i++)
			availablePositions.add(i);
	}

	// returns whether move is possible for current board
	public boolean isMovePossible(int pos) {
		if (pos >= 0 && pos < boardDimension * boardDimension)
			return board[pos] == 0;
		return false;
	}

	// checks whther winning state is reached
	public boolean isGameOver() {

		int number_X = 0;
		int number_0 = 0;

		int totalPositions = boardDimension * boardDimension;

		// check rows
		for (int i = 0; i < totalPositions; i += boardDimension) {
			for (int j = i; j < (i + boardDimension); j++) {
				if (board[j] == 1)
					number_X += 1;
				else if (board[j] == 2)
					number_0 += 1;
			}
			if (number_X == boardDimension) {
				System.out.println("You Win!");
				return true;
			} else if (number_0 == boardDimension) {
				System.out.println("I win!");
				return true;
			}
			number_X = 0;
			number_0 = 0;
		}

		// check columns
		for (int i = 0; i < boardDimension; i++) {
			for (int j = i; j < totalPositions; j += boardDimension) {
				if (board[j] == 1)
					number_X += 1;
				else if (board[j] == 2)
					number_0 += 1;
			}
			if (number_X == boardDimension) {
				System.out.println("You Win!");
				return true;
			} else if (number_0 == boardDimension) {
				System.out.println("I win!");
				return true;
			}
			number_X = 0;
			number_0 = 0;
		}

		// check diagonals
		for (int i = 0; i < totalPositions; i += (boardDimension + 1))
			if (board[i] == 1)
				number_X += 1;
			else if (board[i] == 2)
				number_0 += 1;

		if (number_X == boardDimension) {
			System.out.println("You Win!");
			return true;
		} else if (number_0 == boardDimension) {
			System.out.println("I win!");
			return true;
		}

		return false;
	}

	// update board state with move
	public void makeMove(int pos, int turn) {

		switch (turn) {
		case 1:
			board[pos] = 1;
			break;
		case 2:
			board[pos] = 2;
			break;
		}
	}

	// generate random position for computer player
	public int calculatePosition() {
		Collections.shuffle(availablePositions);
		int pos = availablePositions.get(0);
		availablePositions.remove(0);
		return pos;
	}

	// begins game execution
	public void startGame() {
		int turn = 1;
		int pos;

		while (!isGameOver()) {

			if (turn == 1) {

				System.out.print("Your turn, enter position:");
				pos = Integer.parseInt(sc.next());

				while (!isMovePossible(pos)) {

					System.out.print("Invalid Move!Enter again:");
					pos = Integer.parseInt(sc.next());

				}

				makeMove(pos, turn);
				availablePositions.remove(availablePositions.indexOf(pos));

			} else {

				System.out.println("My turn...");

				try {
					Thread.currentThread().sleep(2000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}

				pos = calculatePosition();
				makeMove(pos, turn);
			}

			System.out.println();
			printBoard();

			if (turn == 1)
				turn = 2;
			else
				turn = 1;
		}
		sc.close();
	}

	// initializes the board state
	public void initBoard() {
		int totalPositions = boardDimension * boardDimension;
		for (int i = 0; i < totalPositions; i++)
			board[i] = 0;
	}

	// prints to console
	public void printBoard() {
		int totalPositions = boardDimension * boardDimension;

		for (int i = 0; i < totalPositions; i++) {

			if (i != 0 && i % boardDimension == 0)
				System.out.println();

			if (board[i] == 0)
				System.out.print(" _ ");

			else if (board[i] == 1)
				System.out.print(" X ");

			else
				System.out.print(" 0 ");
		}
		System.out.println();
		System.out.println();
	}

	public static void gameRules() {
		System.out.println("1. Board positions start from 0 to (boardDimension*boardDimension - 1)");
		System.out.println("2. You take 'X'");
		System.out.println();
	}

	public static void main(String[] args) {

		System.out.println("Welcome to Tic Tac Toe!");
		gameRules();
		System.out.print("Enter the board dimension:");
		String str = sc.next();
		int size = -1;
		try {
			size = Integer.parseInt(str);
		} catch (Exception e) {
			System.out.println("Exception! You did not enter a number");
			System.exit(0);
		}
		new TicTacToe(size);
	}
}