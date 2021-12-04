#include <stdio.h>
#include <stdlib.h>
#define DIM 5
#define FN "input.txt"
#define EXT_SEP ','

typedef struct ext_node_ {
  int n;
  struct ext_node_ *next;
} ext_node_t;

typedef struct board_node_ {
  int board[DIM][DIM];
  struct board_node_ *next;
} board_node_t;

typedef struct {
  ext_node_t *ext;
  board_node_t *boards;
} system_t;

int load(system_t *sys, char *fn);
ext_node_t *extAppend(ext_node_t *h, int n);
board_node_t *boardAppend(board_node_t *h, int b[DIM][DIM]);
board_node_t *getWinningBoard(system_t *sys, int *iterations);
int getExtAt(ext_node_t *h, int index);
int getExtLength(ext_node_t *h);
int extIncludes(ext_node_t *h, int n, int extN);
int isBoardWinning(int b[DIM][DIM], ext_node_t *ext, int extN);
void displayBoard(board_node_t *board);
int accUnmarked(board_node_t *board, ext_node_t *ext, int extN);
board_node_t *getLastWinningBoard(system_t *sys, int *iterations);
int getBoardsLength(board_node_t *h);
board_node_t *removeBoard(board_node_t *h, int b[DIM][DIM]);
int boardEquals(int a[DIM][DIM], int b[DIM][DIM]);

int main() {
  system_t sys;
  board_node_t *winningBoard, *lastWinner;
  int tmp, iterations, acc, lastCalled;

  tmp = load(&sys, FN);

  if (tmp) {
    winningBoard = getWinningBoard(&sys, &iterations);
    printf("[P1] Winning board:\n");
    displayBoard(winningBoard);
    printf("[P1] Iterations: %d\n", iterations);

    acc = accUnmarked(winningBoard, sys.ext, iterations);
    lastCalled = getExtAt(sys.ext, iterations - 1);
    printf("[P1] acc: %d, last: %d, score: %d\n\n", acc, lastCalled,
           acc * lastCalled);

    lastWinner = getLastWinningBoard(&sys, &iterations);
    printf("[P2] Last winning board:\n");
    displayBoard(lastWinner);
    printf("[P2] Iterations: %d\n", iterations);

    acc = accUnmarked(lastWinner, sys.ext, iterations);
    lastCalled = getExtAt(sys.ext, iterations - 1);
    printf("[P2] acc: %d, last: %d, score: %d\n", acc, lastCalled,
           acc * lastCalled);
  }

  return 0;
}

int load(system_t *sys, char *fn) {
  FILE *fp;
  int tmpN, tmpBoard[DIM][DIM];
  int i, j;
  char sep;

  fp = fopen(fn, "r");

  if (fp) {
    sys->ext = NULL;
    fscanf(fp, "%d %c", &tmpN, &sep);
    while (sep == EXT_SEP) {
      sys->ext = extAppend(sys->ext, tmpN);
      fscanf(fp, "%d %c", &tmpN, &sep);
    }
    sys->ext = extAppend(sys->ext, tmpN);

    sys->boards = NULL;
    fscanf(fp, "%d", &tmpBoard[0][0]);
    while (!feof(fp)) {
      for (i = 0; i < DIM && !feof(fp); i++) {
        tmpN = 0;
        if (i == 0)
          tmpN = 1;
        for (j = tmpN; j < DIM && !feof(fp); j++)
          fscanf(fp, "%d", &tmpBoard[i][j]);
      }
      sys->boards = boardAppend(sys->boards, tmpBoard);
      fscanf(fp, "%d", &tmpBoard[0][0]);
    }

    fclose(fp);
    return 1;
  } else {
    printf("[P1] File access error.\n");
    return 0;
  }
}

ext_node_t *extAppend(ext_node_t *h, int n) {
  ext_node_t *tmp, *last;

  tmp = malloc(sizeof(ext_node_t));

  if (tmp) {
    tmp->n = n;
    tmp->next = NULL;

    if (h) {
      for (last = h; last && last->next; last = last->next)
        ;
      last->next = tmp;
    } else
      h = tmp;
  } else
    printf("[extAppend] Allocation error.\n");

  return h;
}

board_node_t *boardAppend(board_node_t *h, int b[DIM][DIM]) {
  board_node_t *tmp, *last;
  int i, j;

  tmp = malloc(sizeof(board_node_t));

  if (tmp) {
    for (i = 0; i < DIM; i++) {
      for (j = 0; j < DIM; j++) {
        tmp->board[i][j] = b[i][j];
      }
    }
    tmp->next = NULL;

    if (h) {
      for (last = h; last && last->next; last = last->next)
        ;
      last->next = tmp;
    } else
      h = tmp;
  } else
    printf("[extAppend] Allocation error.\n");

  return h;
}

board_node_t *getWinningBoard(system_t *sys, int *iterations) {
  int extLength, extN;
  board_node_t *currBoard, *winning;

  extLength = getExtLength(sys->ext);
  winning = NULL;

  for (extN = 1; extN <= extLength && !winning; extN++) {
    for (currBoard = sys->boards; currBoard && !winning;
         currBoard = currBoard->next) {
      if (isBoardWinning(currBoard->board, sys->ext, extN)) {
        winning = currBoard;
        *iterations = extN;
      }
    }
  }

  return winning;
}

int getExtAt(ext_node_t *h, int index) {
  for (; h && index; h = h->next, index--)
    ;

  if (h)
    return h->n;
  else
    return -1;
}

int getExtLength(ext_node_t *h) {
  int count;

  for (count = 0; h; h = h->next, count++)
    ;

  return count;
}

int extIncludes(ext_node_t *h, int n, int extN) {
  int res;

  for (res = 0; !res && h && extN; h = h->next, extN--) {
    if (h->n == n)
      res = 1;
  }

  return res;
}

int isBoardWinning(int b[DIM][DIM], ext_node_t *ext, int extN) {
  int res, i, j, valid;

  res = 0;
  for (i = 0; i < DIM && !res; i++) {
    valid = 1;
    for (j = 0; j < DIM && valid; j++) {
      if (!extIncludes(ext, b[i][j], extN))
        valid = 0;
    }
    if (valid)
      res = 1;
  }
  for (i = 0; i < DIM && !res; i++) {
    valid = 1;
    for (j = 0; j < DIM && valid; j++) {
      if (!extIncludes(ext, b[j][i], extN))
        valid = 0;
    }
    if (valid)
      res = 1;
  }

  return res;
}

void displayBoard(board_node_t *board) {
  int i, j;

  for (i = 0; i < DIM; i++) {
    for (j = 0; j < DIM; j++)
      printf("%2d ", board->board[i][j]);
    printf("\n");
  }
}

int accUnmarked(board_node_t *board, ext_node_t *ext, int extN) {
  int acc, i, j;

  acc = 0;
  for (i = 0; i < DIM; i++) {
    for (j = 0; j < DIM; j++) {
      if (!extIncludes(ext, board->board[i][j], extN))
        acc += board->board[i][j];
    }
  }

  return acc;
}

board_node_t *getLastWinningBoard(system_t *sys, int *iterations) {
  int extLength, extN;
  board_node_t *currBoard, *lastWinner;

  extLength = getExtLength(sys->ext);

  for (extN = 1; extN <= extLength && getBoardsLength(sys->boards); extN++) {
    for (currBoard = sys->boards; currBoard; currBoard = currBoard->next) {
      if (isBoardWinning(currBoard->board, sys->ext, extN)) {
        sys->boards = removeBoard(sys->boards, currBoard->board);
        lastWinner = currBoard;
        *iterations = extN;
      }
    }
  }

  return lastWinner;
}

int getBoardsLength(board_node_t *h) {
  int count;

  for (count = 0; h; h = h->next, count++)
    ;

  return count;
}

board_node_t *removeBoard(board_node_t *h, int b[DIM][DIM]) {
  board_node_t *curr, *prev;

  for (prev = NULL, curr = h; curr; prev = curr, curr = curr->next) {
    if (boardEquals(curr->board, b)) {
      if (prev)
        prev->next = curr->next;
      else
        h = h->next;

      free(curr);
    }
  }

  return h;
}

int boardEquals(int a[DIM][DIM], int b[DIM][DIM]) {
  int i, j, res;

  res = 1;
  for (i = 0; i < DIM && res; i++) {
    for (j = 0; j < DIM && res; j++) {
      if (a[i][j] != b[i][j])
        res = 0;
    }
  }

  return res;
}
