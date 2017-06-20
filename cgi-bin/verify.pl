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

my $name    = $pairs{ex};
my $type  = $pairs{type}; 
my $program = $pairs{program};
#my $prover = $pairs{provers};
my $options = $pairs{options};
#my $random_number = rand(100000000);
my $random_number = int(rand(1000));

#$testfile = "test.79414422.5846143.ss";
my $outputFile = $outputFolder.$name.".".$random_number.".".$type;
#my $outputFile = $outputFolder.$testfile;
open(SRCFILE, '>', $outputFile) or die "Cannot open file for writing: $outputFile";
print SRCFILE "$program";
close(SRCFILE);

my $outputResFileName = $name.".".$random_number.".".$type.".txt";
my $showinputFile = $name.".".$random_number.".".$type;
my $inputFile = $outputFolder.$outputResFileName;

my $cmdType = "";
if ($type eq "slk") {
	$cmdType = "timeout 4 ./sleek ";	
} else {
	$cmdType = "timeout 8 ./hip ";	
}

$cmd = "";
$opts = "--ann-vp ";
if ($options eq "eps"){
	$opts = $opts." --eps";
} elsif ($options eq "oceps") {
	$opts = $opts." -tp oc --eps";	
} elsif ($options eq "oc") {
	$opts = $opts." ";	
} elsif ($options eq "rl") {
	$opts = $opts." -tp redlog";	
} elsif ($options eq "infereps") {
	$opts = $opts." --infer-mem --eps";	
}

$cmd = $cmdType." ".$outputFile." ".$opts." > ".$inputFile." 2>&1";
system($cmd);

#open(SRCFILE, '>>', $inputFile) or die "Cannot open file for writing: $inputFile";
#print SRCFILE "$cmd";
#close(SRCFILE);

#print $cmd;

# if ($prover eq "auto") {
# 	$cmd = $cmdType.$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "omega") {
# 	$cmd = $cmdType." -tp oc ".$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "z3") {
# 	$cmd = $cmdType." -tp z3 ".$outputFile." > ".$inputFile." 2>&1";
# } elsif ($prover eq "mona") {
# 	$cmd = $cmdType." -tp mona ".$outputFile." > ".$inputFile." 2>&1";
# }

#my $result = "1111";

#open(RESULTFILE, '<', $inputFile) or die "Cannot open file for reading: $inputFile";
#while (<RESULTFILE>) { 
#	$result = $result.$_."<br/>";
#}
#close(RESULTFILE);

#system("rm -f *.mona *.oc *.rl *.set *.thy *.v *.z3 *.minisat oc.out reduce.log .mona_temp* .oc_temp* mona.failure");
#donot remove the files for later checkup
#my @delFiles = ($outputFile, $inputFile);
#unlink @delFiles;

#print( STDOUT "Content-Type:text/html\r\n" );
#print( STDOUT "Status: 200 Ok\r\n" );
#print( STDOUT "\r\n" );
#
#print( STDOUT <<HTML );
#<html>
#	<head>
#		<title>Program Verification Result</title>
#	</head>
#	
#	<body>
#		<div>
#			<span style="font-weight:bold;color:#333399;font-size:16px">Result</span>
#			<br/>
#			<span style="font-size:14px">$result</span>
#			<br/>
#		</div>
#	</body>
#</html>
#HTML

#my $filename = "../infer.html?ex=insertion_simple&type=ss&options=oc";  #whatever
#system("start file://$filename");
#    print "Content-type: text/html\n\n";
#    open (HTML, "<../infer.html?ex=insertion_simple&type=ss&options=oc");
#    print <HTML>;
#    close (HTML);

#print redirect(-url=>'../../HIPimm_test/infer.html?ex=insertion_simple&type=ss&options=oc');
my $nparams = "ex=".$showinputFile."&type=".$type."&options=".$options."&result=$outputResFileName";

print ("Location: ../infer.html?".$nparams." \n\n");

