# Check if environment name is provided as command line argument
if [ $# -eq 0 ]; then
  echo "Please provide the environment name as a command line argument."
  exit 1
fi

# Set environment name from command line argument
env_name=$1

# Set conda path to system file
if [ ! $(which conda) ]; then
  echo "Not found conda path in 'which conda' command"
  exit 1
elif [ -z "$conda_path" ] || [ ! $conda_path = $(which conda) ]; then
  conda_path=$(which conda)
  echo "conda_path $conda_path"
else
  echo "Already set the conda path"
fi
eval "$($conda_path shell.bash hook)"
conda activate $env_name

# Run
npm i
npm run dev