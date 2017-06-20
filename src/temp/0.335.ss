// Enter your own example here or
// Choose an example on the left panel.
data NodeSll {
  int data1; 
  NodeSll next; 
}


sll<n> == emp & self = null & n=0  or self::NodeSll<_, q> * q::sll<n-1>;

NodeSll create(int n)
  requires true
  ensures res::sll<n>;
{
  if (n == 0) return null;
  else {
    NodeSll x = new NodeSll(n, null);
    x.next = create(n-1);
    return x;
  }
}

int getSum(NodeSll x, NodeSll y)
  /* requires y::sll<n> & x=null */
  /* ensures x::sll<m> * y::sll<n>; */
  requires x::sll<m> * y::sll<n> & m <= n
  ensures x::sll<m> * y::sll<n> & m <= n;
{
  int sum = 0;
  if (x != null){
    sum += x.data1 + y.data1;
    sum += getSum(x.next, y.next);
  }

  return sum;
}

int main1(int m, int n)
  requires n>= m
  ensures true;
{
  NodeSll x = create(m);
  NodeSll y = create(n);
  getSum(x,y);
  return 0;
}