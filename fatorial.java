class Main {

	public static Double fatorial (int n)
	{
        return n > 1 ? n * fatorial(n - 1) : 1;
	}

	public static void main(String[] args) {
		Double Result = Main.fatorial(5);
		System.out.println(Result);
	}

}