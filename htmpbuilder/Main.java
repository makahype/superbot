import java.io.*;

class Sbhtmps {
  public static void main(String[] args) throws IOException{
  	//variable to hold template strings
	String file_cnt_res = "var htmps = {};\n";

	for(int i=0; i < args.length; i++){

		InputStream filest = new FileInputStream(args[i]+".htmp");
		BufferedReader buf = new BufferedReader(new InputStreamReader(filest));
		
		String file_ln = buf.readLine();
		StringBuilder file_cnt = new StringBuilder();

		while(file_ln != null){
			file_cnt.append(file_ln.replace("\\","\\\\")).append("\\n");
			file_ln = buf.readLine();
		}

		//append variable to hold string
		file_cnt_res = file_cnt_res + "htmps."+args[i]+" = \""+file_cnt.toString().replace("\"", "\\\""	)+"\";\n";
	
	}

	//create file will all templates
	BufferedWriter writer = new BufferedWriter(new FileWriter("htmps.js"));
	writer.write(file_cnt_res);
	writer.close();

  }




}
