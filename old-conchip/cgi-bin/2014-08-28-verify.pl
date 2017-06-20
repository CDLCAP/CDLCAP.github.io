#!/usr/bin/perl

my $query;

read(STDIN, $query, $ENV{CONTENT_LENGTH} );

my @param = split( /&/, $query );
my %pairs = ();

foreach my $item (@param) {
	my ($key, $value) = split( /=/, $item );
	$key   =~ tr/+/ /;
	$value =~ tr/+/ /;
	$key   =~ s/%([A-F\d]{2})/chr(hex($1))/ieg;
	$value =~ s/%([A-F\d]{2})/chr(hex($1))/ieg;

	$pairs{$key} = $value;
}

my $outputFolder = "../src/temp/";

my $name    = $pairs{name};
my $type  = $pairs{type}; 
my $program = $pairs{program};
my $prover = $pairs{provers};

my $random_number = rand(100000000);

my $outputFile = $outputFolder.$name.".".$random_number.".".$type;
open(SRCFILE, '>', $outputFile) or die "Cannot open file for writing: $outputFile";
print SRCFILE "$program";
close(SRCFILE);

my $inputFile = $outputFolder.$name.".".$random_number.".".$type.".txt";

my $cmdType = "";
if ($type eq "slk") {
	$cmdType = "./sleek ";	
} else {
	$cmdType = "./conchip --en-para --en-thrd-resource -tp parahip --en-lsmu-infer";
}

$cmd = "";

$cmd = $cmdType." ".$outputFile." > ".$inputFile." 2>&1";

# if ($prover eq "auto") {
# 	$cmd = $cmdType.$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "omega") {
# 	$cmd = $cmdType." -tp oc ".$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "z3") {
# 	$cmd = $cmdType." -tp z3 ".$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "mona") {
# 	$cmd = $cmdType." -tp mona ".$outputFile." > ".$inputFile." 2>&1";
# }

system($cmd);

my $result = "";

open(RESULTFILE, '<', $inputFile) or die "Cannot open file for reading: $inputFile";
while (<RESULTFILE>) { 
	$result = $result.$_."<br/>";
}
close(RESULTFILE);

system("rm -f *.mona *.oc *.rl *.set *.thy *.v *.z3 *.minisat oc.out reduce.log .mona_temp*");
#donot remove the files for later checkup
#my @delFiles = ($outputFile, $inputFile);
#unlink @delFiles;

print( STDOUT "Content-Type:text/html\r\n" );
print( STDOUT "Status: 200 Ok\r\n" );
print( STDOUT "\r\n" );

print( STDOUT <<HTML );
<html>
	<head>
		<title>Program Verification Result</title>
	</head>
	
	<body>
		<div>
			<span style="font-weight:bold;color:#333399;font-size:16px">Result</span>
			<br/>
			<span style="font-size:14px">$result</span>
			<br/>
		</div>
	</body>
</html>
HTML


