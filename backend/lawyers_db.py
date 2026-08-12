# Database of available lawyers
from typing import Optional
from models import Lawyer

LAWYERS_DATABASE = [
    Lawyer(
        id="1",
        name="Rajesh Kumar",
        email="rajesh@legalservices.com",
        phone="+91-9876543210",
        specialization=["Constitutional Law", "Administrative Law"],
        years_of_experience=15,
        rating=4.8,
        bio="Expert in constitutional matters with 15 years of experience",
        available_now=True,
    ),
    Lawyer(
        id="2",
        name="Priya Sharma",
        email="priya@legalservices.com",
        phone="+91-9876543211",
        specialization=["Family Law", "Domestic Relations"],
        years_of_experience=12,
        rating=4.9,
        bio="Specialized in family law cases with compassionate approach",
        available_now=True,
    ),
    Lawyer(
        id="3",
        name="Arjun Singh",
        email="arjun@legalservices.com",
        phone="+91-9876543212",
        specialization=["Corporate Law", "Business Law", "Contracts"],
        years_of_experience=18,
        rating=4.7,
        bio="Leading corporate lawyer with extensive business law expertise",
        available_now=False,
    ),
    Lawyer(
        id="4",
        name="Neha Gupta",
        email="neha@legalservices.com",
        phone="+91-9876543213",
        specialization=["Criminal Law", "Litigation"],
        years_of_experience=14,
        rating=4.8,
        bio="Expert criminal defense and prosecution specialist",
        available_now=True,
    ),
    Lawyer(
        id="5",
        name="Vikram Patel",
        email="vikram@legalservices.com",
        phone="+91-9876543214",
        specialization=["Property Law", "Real Estate"],
        years_of_experience=16,
        rating=4.6,
        bio="Veteran in property and real estate transactions",
        available_now=True,
    ),
    Lawyer(
        id="6",
        name="Anjali Verma",
        email="anjali@legalservices.com",
        phone="+91-9876543215",
        specialization=["Labor Law", "Employment Law"],
        years_of_experience=11,
        rating=4.7,
        bio="Focused on workers' rights and employment disputes",
        available_now=True,
    ),
]


def find_lawyers_by_specialization(specialization: str) -> list:
    """Find lawyers by their specialization"""
    return [
        lawyer for lawyer in LAWYERS_DATABASE
        if any(spec.lower() in lawyer.specialization for spec in [specialization.lower()])
    ]


def find_best_lawyer(specialization: str) -> Optional[Lawyer]:
    """Find the best lawyer for a given specialization"""
    matching = find_lawyers_by_specialization(specialization)
    if not matching:
        return None
    
    # Sort by availability and rating and return the best match
    matching.sort(key=lambda x: (not x.available_now, -x.rating))
    return matching[0]
