class Calc
    def fatorial(n)
        return n > 1 ? n * fatorial(n - 1) : 1
    end
end

calc = Calc.new()
number = 5
result = calc.fatorial(number)
puts "Resultado: #{number}! = #{result}"


