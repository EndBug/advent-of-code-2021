#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define FN "input.txt"
#define NBIT 12
#define BASE2 2

typedef struct node_ {
  char num[NBIT + 1];
  struct node_ *next;
} node_t;

node_t *push(node_t *h, char *n);
node_t *append(node_t *h, char *n);
node_t *loadFromFile(node_t *h, char *fn);
node_t *shift(node_t *h);
int length(node_t *h);
char getMostCommonBit(node_t *h, int index);
node_t *filterByBit(node_t *h, char bit, int index);
int binStrToInt(char *bin);

int main() {
  node_t *h;
  char oxyBin[NBIT + 1], co2Bin[NBIT + 1], bit;
  int i, oxy, co2;

  h = NULL;

  h = loadFromFile(h, FN);
  for (i = 0; i < NBIT && length(h) != 1; i++) {
    bit = getMostCommonBit(h, i);
    h = filterByBit(h, bit, i);
  }
  strcpy(oxyBin, h->num);

  h = loadFromFile(h, FN);
  for (i = 0; i < NBIT && length(h) != 1; i++) {
    if (getMostCommonBit(h, i) == '1')
      bit = '0';
    else
      bit = '1';
    h = filterByBit(h, bit, i);
  }
  strcpy(co2Bin, h->num);

  oxy = binStrToInt(oxyBin);
  co2 = binStrToInt(co2Bin);

  printf("[P2] oxy: %d, co2: %d, oxy*co2: %d\n", oxy, co2, oxy * co2);

  return 0;
}

node_t *push(node_t *h, char *n) {
  node_t *tmp;
  tmp = malloc(sizeof(node_t));

  if (tmp) {
    strcpy(tmp->num, n);
    tmp->next = h;
    h = tmp;
  } else
    printf("Errore allocazione.\n");

  return h;
}
node_t *append(node_t *h, char *n) {
  node_t *tmp;

  if (h == NULL)
    return push(h, n);

  h->next = append(h->next, n);
  return h;
}
node_t *loadFromFile(node_t *h, char *fn) {
  FILE *fp;
  char tmp[NBIT + 1];

  fp = fopen(fn, "r");

  if (fp) {
    fscanf(fp, "%s", tmp);

    while (!feof(fp)) {
      h = append(h, tmp);
      fscanf(fp, "%s", tmp);
    }

    fclose(fp);
  } else
    printf("[loadFromFile] File access error.\n");

  return h;
}
node_t *shift(node_t *h) {
  node_t *tmp;

  if (h) {
    tmp = h;
    h = h->next;

    free(tmp);
  }

  return h;
}
int length(node_t *h) {
  int count;
  for (count = 0; h; h = h->next)
    count++;
  return count;
}

char getMostCommonBit(node_t *h, int index) {
  int count;

  for (count = 0; h; h = h->next) {
    if ((h->num)[index] == '0')
      count--;
    else
      count++;
  }

  if (count >= 0)
    return '1';
  else
    return '0';
}
node_t *filterByBit(node_t *h, char bit, int index) {
  if (h) {
    if ((h->num)[index] == bit) {
      h->next = filterByBit(h->next, bit, index);
    } else {
      h = filterByBit(shift(h), bit, index);
    }
  }

  return h;
}

int binStrToInt(char *bin) {
  int i, pot2, res;

  for (i = NBIT - 1, pot2 = 1, res = 0; i >= 0; i--, pot2 *= BASE2) {
    if (bin[i] == '1')
      res += pot2;
  }

  return res;
}
