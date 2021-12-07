#include <stdio.h>
#include <stdlib.h>
#define FN "input.txt"

typedef struct crab_ {
  int pos;
  struct crab_ *next;
} crab_t;

crab_t *load();
crab_t *add(crab_t *h, int pos);
void partOne(crab_t *input);
int maxPos(crab_t *h);
int abs(int n);
crab_t *get(crab_t *h, int index);
int length(crab_t *h);
void partTwo(crab_t *input);

int main() {
  crab_t *input;

  input = load();

  partOne(input);
  partTwo(input);

  return 0;
}

crab_t *load() {
  FILE *fp;
  crab_t *input;
  int tmp;

  fp = fopen(FN, "r");
  input = NULL;

  if (fp) {
    fscanf(fp, "%d %*c", &tmp);

    while (!feof(fp)) {
      input = add(input, tmp);
      fscanf(fp, "%d %*c", &tmp);
    }
    input = add(input, tmp);

    fclose(fp);
  } else
    printf("[load] File access error.\n");

  return input;
}

crab_t *add(crab_t *h, int pos) {
  crab_t *tmp;

  tmp = malloc(sizeof(crab_t));

  if (tmp) {
    tmp->pos = pos;
    tmp->next = h;
    h = tmp;
  } else
    printf("[append] Allocation error.\n");

  return h;
}

void partOne(crab_t *input) {
  int i, j, max, pos, cost, currCost, iDim;

  max = maxPos(input);
  iDim = length(input);

  pos = -1;
  for (i = 0; i <= max; i++) {
    currCost = 0;
    for (j = 0; j < iDim; j++)
      currCost += abs(i - get(input, j)->pos);

    if (pos == -1 || currCost < cost) {
      pos = i;
      cost = currCost;
    }
  }

  printf("[P1] %d %d\n", pos, cost);
}

int maxPos(crab_t *h) {
  int max;

  for (max = 0; h; h = h->next)
    if (max < h->pos)
      max = h->pos;

  return max;
}

int abs(int n) {
  if (n < 0)
    return -n;
  else
    return n;
}

crab_t *get(crab_t *h, int index) {
  for (; index; index--, h = h->next)
    ;
  return h;
}

int length(crab_t *h) {
  int l;
  for (l = 0; h; h = h->next, l++)
    ;
  return l;
}

void partTwo(crab_t *input) {
  int i, j, max, pos, cost, currCost, iDim, currDist;

  max = maxPos(input);
  iDim = length(input);

  pos = -1;
  for (i = 0; i <= max; i++) {
    currCost = 0;
    for (j = 0; j < iDim; j++) {
      currDist = abs(i - get(input, j)->pos);
      for (; currDist; currDist--)
        currCost += currDist;
    }
    if (pos == -1 || currCost < cost) {
      pos = i;
      cost = currCost;
    }
  }

  printf("[P2] %d %d\n", pos, cost);
}
